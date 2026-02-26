using System.Security.Cryptography;
using System.Text;
using ECommerce.Api.Common.Models;
using ECommerce.Api.Data;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Features.Payment;

public record CreateVnPayPaymentRequest(string OrderId, decimal Amount, string? BankCode, string OrderInfo);
public record VnPayPaymentResponse(string PaymentUrl);

// ── Create VNPay Payment ──
public record CreateVnPayPaymentCommand(int OrderId, decimal Amount, string? BankCode, string OrderInfo)
    : IRequest<Result<VnPayPaymentResponse>>;

public class CreateVnPayPaymentValidator : AbstractValidator<CreateVnPayPaymentCommand>
{
    public CreateVnPayPaymentValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0);
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.OrderInfo).NotEmpty();
    }
}

public class CreateVnPayPaymentHandler : IRequestHandler<CreateVnPayPaymentCommand, Result<VnPayPaymentResponse>>
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateVnPayPaymentHandler(AppDbContext db, IConfiguration config, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _config = config;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Result<VnPayPaymentResponse>> Handle(CreateVnPayPaymentCommand request, CancellationToken ct)
    {
        var order = await _db.Orders.FindAsync(new object[] { request.OrderId }, ct);
        if (order is null)
            return Result<VnPayPaymentResponse>.NotFound("Order not found");

        var txnRef = request.OrderId.ToString();
        order.TxnRef = txnRef;
        await _db.SaveChangesAsync(ct);

        var tmnCode = _config["VnPay:TmnCode"] ?? "";
        var secretKey = _config["VnPay:SecretKey"] ?? "";
        var vnpUrl = _config["VnPay:Url"] ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var returnUrl = _config["VnPay:ReturnUrl"] ?? "http://localhost:5173/vnpay-return";

        var now = DateTime.Now;
        var createDate = now.ToString("yyyyMMddHHmmss");

        var vnpParams = new SortedDictionary<string, string>
        {
            ["vnp_Version"] = "2.1.0",
            ["vnp_Command"] = "pay",
            ["vnp_TmnCode"] = tmnCode,
            ["vnp_Locale"] = "vn",
            ["vnp_CurrCode"] = "VND",
            ["vnp_TxnRef"] = txnRef,
            ["vnp_OrderInfo"] = request.OrderInfo,
            ["vnp_OrderType"] = "other",
            ["vnp_Amount"] = ((long)(request.Amount * 100)).ToString(),
            ["vnp_ReturnUrl"] = returnUrl,
            ["vnp_IpAddr"] = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1",
            ["vnp_CreateDate"] = createDate,
        };

        var signData = string.Join("&", vnpParams.Select(kvp =>
            $"{kvp.Key}={Uri.EscapeDataString(kvp.Value).Replace("%20", "+")}"));

        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(secretKey));
        var hash = BitConverter.ToString(hmac.ComputeHash(Encoding.UTF8.GetBytes(signData))).Replace("-", "").ToLower();

        var paymentUrl = $"{vnpUrl}?{signData}&vnp_SecureHash={hash}";
        return Result<VnPayPaymentResponse>.Success(new VnPayPaymentResponse(paymentUrl));
    }
}

// ── Handle VNPay IPN ──
public record HandleVnPayIpnCommand(Dictionary<string, string> Params) : IRequest<Result<object>>;

public class HandleVnPayIpnHandler : IRequestHandler<HandleVnPayIpnCommand, Result<object>>
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<HandleVnPayIpnHandler> _logger;

    public HandleVnPayIpnHandler(AppDbContext db, IConfiguration config, ILogger<HandleVnPayIpnHandler> logger)
    {
        _db = db;
        _config = config;
        _logger = logger;
    }

    public async Task<Result<object>> Handle(HandleVnPayIpnCommand request, CancellationToken ct)
    {
        var vnpParams = new Dictionary<string, string>(request.Params);

        if (!vnpParams.TryGetValue("vnp_SecureHash", out var secureHash) || string.IsNullOrEmpty(secureHash))
            return Result<object>.Success(new { RspCode = "97", Message = "Missing secure hash" });

        vnpParams.Remove("vnp_SecureHash");
        vnpParams.Remove("vnp_SecureHashType");

        var sortedParams = new SortedDictionary<string, string>(vnpParams);
        var signData = string.Join("&", sortedParams
            .Where(kvp => !string.IsNullOrEmpty(kvp.Value))
            .Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}"));

        var secretKey = _config["VnPay:SecretKey"] ?? "";
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(secretKey));
        var computed = BitConverter.ToString(hmac.ComputeHash(Encoding.UTF8.GetBytes(signData))).Replace("-", "").ToLower();

        if (secureHash.ToLower() != computed)
            return Result<object>.Success(new { RspCode = "97", Message = "Invalid signature" });

        vnpParams.TryGetValue("vnp_TxnRef", out var txnRef);
        vnpParams.TryGetValue("vnp_ResponseCode", out var rspCode);

        if (string.IsNullOrEmpty(txnRef) || string.IsNullOrEmpty(rspCode))
            return Result<object>.Success(new { RspCode = "01", Message = "Missing required parameters" });

        var order = await _db.Orders.FirstOrDefaultAsync(o => o.TxnRef == txnRef, ct);
        if (order is null)
            return Result<object>.Success(new { RspCode = "01", Message = "Order not found" });

        if (rspCode == "00")
        {
            order.Status = 0;
            order.PaymentMethod = "vnpay";
            await _db.SaveChangesAsync(ct);
            return Result<object>.Success(new { RspCode = "00", Message = "Success" });
        }
        else
        {
            order.Status = -2;
            await _db.SaveChangesAsync(ct);
            return Result<object>.Success(new { RspCode = "01", Message = "Transaction failed" });
        }
    }
}
