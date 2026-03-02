using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Features.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController(IMediator mediator) : ControllerBase
{
    /// <summary>Register a new user</summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? StatusCode(result.StatusCode, result.Value)
            : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Login and receive JWT + refresh token</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? Ok(result.Value)
            : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Refresh access token using refresh token cookie</summary>
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var result = await mediator.Send(new RefreshTokenCommand());
        return result.IsSuccess
            ? Ok(result.Value)
            : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Login via Google OAuth</summary>
    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginCommand command)
    {
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? Ok(result.Value)
            : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Request password reset email</summary>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? Ok(result.Value)
            : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Reset password with token</summary>
    [HttpPost("reset-password/{token}")]
    public async Task<IActionResult> ResetPassword(string token, [FromBody] ResetPasswordBody body)
    {
        var command = new ResetPasswordCommand(token, body.Password, body.ConfirmPassword);
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? Ok(result.Value)
            : StatusCode(result.StatusCode, new { message = result.Error });
    }
}

public record ResetPasswordBody(string Password, string ConfirmPassword);
