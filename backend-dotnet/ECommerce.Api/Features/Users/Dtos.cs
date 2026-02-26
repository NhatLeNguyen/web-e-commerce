namespace ECommerce.Api.Features.Users;

public record UserDto(int Id, string FullName, string Email, string Role, string Avatar);
public record UpdateUserRequest(string FullName, string Email, string? Avatar, string? Role);
public record UpdateUserInfoRequest(string FullName, string Email);
public record ChangePasswordRequest(int UserId, string OldPassword, string NewPassword);
