using ECommerce.Api.Common.Models;
using ECommerce.Api.Data;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Features.Auth;

// ── Forgot Password ──
public record ForgotPasswordCommand(string Email) : IRequest<Result<MessageResponse>>;

public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}

public class ForgotPasswordHandler(
    AppDbContext db,
    ILogger<ForgotPasswordHandler> logger) : IRequestHandler<ForgotPasswordCommand, Result<MessageResponse>>
{
    public async Task<Result<MessageResponse>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (user is null)
            return Result<MessageResponse>.NotFound("User not found");

        var resetToken = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32)).ToLower();
        var hashedToken = Convert.ToHexString(
            System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(resetToken))
        ).ToLower();

        user.ResetPasswordToken = hashedToken;
        user.ResetPasswordExpires = DateTime.UtcNow.AddHours(1);
        await db.SaveChangesAsync(cancellationToken);

        // TODO: Send email via SMTP (nodemailer equivalent)
        // For now, log the token so you can test
        logger.LogInformation("Password reset token for {Email}: {Token}", request.Email, resetToken);

        return Result<MessageResponse>.Success(new MessageResponse("Reset password email sent"));
    }
}

// ── Reset Password ──
public record ResetPasswordCommand(string Token, string Password, string ConfirmPassword) : IRequest<Result<MessageResponse>>;

public class ResetPasswordValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Token).NotEmpty();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.ConfirmPassword).Equal(x => x.Password).WithMessage("Passwords do not match");
    }
}

public class ResetPasswordHandler(AppDbContext db) : IRequestHandler<ResetPasswordCommand, Result<MessageResponse>>
{
    public async Task<Result<MessageResponse>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var hashedToken = Convert.ToHexString(
            System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(request.Token))
        ).ToLower();

        var user = await db.Users
            .FirstOrDefaultAsync(u =>
                u.ResetPasswordToken == hashedToken &&
                u.ResetPasswordExpires > DateTime.UtcNow,
                cancellationToken);

        if (user is null)
            return Result<MessageResponse>.Failure("Password reset token is invalid or has expired", 400);

        user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);
        user.ResetPasswordToken = null;
        user.ResetPasswordExpires = null;
        await db.SaveChangesAsync(cancellationToken);

        return Result<MessageResponse>.Success(new MessageResponse("Password reset successful"));
    }
}
