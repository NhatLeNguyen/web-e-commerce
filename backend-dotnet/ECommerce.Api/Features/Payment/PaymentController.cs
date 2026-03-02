using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Features.Payment;

[ApiController]
[Route("api/create_payment")]
public class PaymentController(IMediator mediator) : ControllerBase
{
    /// <summary>Create VNPay payment URL</summary>
    [HttpPost("create-vnpay-payment")]
    public async Task<IActionResult> CreateVnPayPayment([FromBody] CreateVnPayPaymentRequest request)
    {
        var command = new CreateVnPayPaymentCommand(
            int.TryParse(request.OrderId, out var id) ? id : 0,
            request.Amount, request.BankCode, request.OrderInfo);
        var result = await mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>VNPay IPN callback</summary>
    [HttpGet("vnpay-ipn")]
    public async Task<IActionResult> HandleVnPayIpn()
    {
        var queryParams = Request.Query.ToDictionary(q => q.Key, q => q.Value.ToString());
        var result = await mediator.Send(new HandleVnPayIpnCommand(queryParams));
        return Ok(result.Value);
    }

    /// <summary>VNPay return redirect</summary>
    [HttpGet("vnpay-return")]
    public IActionResult HandleVnPayReturn()
    {
        var responseCode = Request.Query["vnp_ResponseCode"].ToString();
        var status = responseCode == "00" ? "success" : "failed";
        return Redirect($"/vnpay-return?payment_status={status}");
    }
}
