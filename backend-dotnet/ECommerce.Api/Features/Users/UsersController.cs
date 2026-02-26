using System.Security.Claims;
using ECommerce.Api.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Features.Users;

[Authorize]
[ApiController]
[Route("api/user")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    public UsersController(IMediator mediator) => _mediator = mediator;

    /// <summary>Get all users</summary>
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var result = await _mediator.Send(new GetAllUsersQuery());
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Get user by ID</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private";
        var result = await _mediator.Send(new GetUserByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Update user (admin only)</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "guest";
        var command = new UpdateUserCommand(id, request.FullName, request.Email, request.Avatar, request.Role, role);
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Update own profile info</summary>
    [HttpPut("info/{id:int}")]
    public async Task<IActionResult> UpdateUserInfo(int id, [FromBody] UpdateUserInfoRequest request)
    {
        var command = new UpdateUserInfoCommand(id, request.FullName, request.Email);
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Delete user (admin only)</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "guest";
        var command = new DeleteUserCommand(id, role);
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Change password</summary>
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var command = new ChangePasswordCommand(request.UserId, request.OldPassword, request.NewPassword);
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }
}

[Authorize]
[ApiController]
[Route("api/avatar")]
public class AvatarController : ControllerBase
{
    private readonly IMediator _mediator;
    public AvatarController(IMediator mediator) => _mediator = mediator;

    /// <summary>Upload avatar (multipart file upload)</summary>
    [HttpPost("{id:int}")]
    public async Task<IActionResult> UploadAvatar(int id, IFormFile avatar)
    {
        if (avatar is null || avatar.Length == 0)
            return BadRequest(new { message = "No file uploaded" });

        using var ms = new MemoryStream();
        await avatar.CopyToAsync(ms);
        var command = new UploadAvatarCommand(id, ms.ToArray());
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }
}
