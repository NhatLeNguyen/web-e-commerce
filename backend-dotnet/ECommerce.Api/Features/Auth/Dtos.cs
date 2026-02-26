namespace ECommerce.Api.Features.Auth;

public record AuthUserDto(int Id, string FullName, string Email, string Role, string Avatar);
public record LoginResponse(AuthUserDto User, string AccessToken);
public record TokenResponse(string AccessToken);
