using ECommerce.Api.Common.Models;
using MediatR;

namespace ECommerce.Api.Features.Auth;

// ── Google Login (placeholder — wire with your Google OAuth credentials) ──
public record GoogleLoginCommand(string AccessToken) : IRequest<Result<LoginResponse>>;

public class GoogleLoginHandler : IRequestHandler<GoogleLoginCommand, Result<LoginResponse>>
{
    private readonly ILogger<GoogleLoginHandler> _logger;

    public GoogleLoginHandler(ILogger<GoogleLoginHandler> logger) => _logger = logger;

    public Task<Result<LoginResponse>> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement Google OAuth validation
        // 1. Call https://www.googleapis.com/oauth2/v3/userinfo with the access_token
        // 2. Get user info (email, name, picture)
        // 3. Find or create user in DB
        // 4. Generate JWT tokens
        // This is a placeholder — identical flow to the Node.js googleLogin controller
        _logger.LogWarning("Google login not yet configured. Provide GOOGLE_CLIENT_ID in appsettings.");
        return Task.FromResult(Result<LoginResponse>.Failure("Google login not configured. Set up Google OAuth credentials.", 501));
    }
}
