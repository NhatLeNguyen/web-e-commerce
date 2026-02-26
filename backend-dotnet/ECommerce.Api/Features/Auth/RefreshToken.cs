using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ECommerce.Api.Common.Models;
using ECommerce.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ECommerce.Api.Features.Auth;

// ── Command ──
public record RefreshTokenCommand : IRequest<Result<TokenResponse>>;

// ── Handler ──
public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, Result<TokenResponse>>
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RefreshTokenHandler(AppDbContext db, IConfiguration config, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _config = config;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Result<TokenResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var refreshTokenValue = httpContext?.Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshTokenValue))
            return Result<TokenResponse>.Unauthorized("No refresh token provided");

        try
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:RefreshTokenSecret"]!));
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(refreshTokenValue, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _config["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);

            // Check if token exists in DB and is not revoked
            var storedToken = await _db.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue && !rt.IsRevoked, cancellationToken);

            if (storedToken is null)
                return Result<TokenResponse>.Unauthorized("Invalid refresh token");

            var userId = int.Parse(principal.FindFirst("id")?.Value ?? "0");
            var email = principal.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var role = principal.FindFirst(ClaimTypes.Role)?.Value ?? "guest";

            // Generate new access token
            var accessKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
            var credentials = new SigningCredentials(accessKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
            };

            var newAccessToken = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:AccessTokenExpirationMinutes"] ?? "10")),
                signingCredentials: credentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(newAccessToken);
            return Result<TokenResponse>.Success(new TokenResponse(tokenString));
        }
        catch (SecurityTokenExpiredException)
        {
            return Result<TokenResponse>.Forbidden("Refresh token expired");
        }
        catch
        {
            return Result<TokenResponse>.Forbidden("Invalid refresh token");
        }
    }
}
