using ECommerce.Api.Common.Models;
using ECommerce.Api.Data;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Features.Users;

// ── Get All Users ──
public record GetAllUsersQuery : IRequest<Result<List<UserDto>>>;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, Result<List<UserDto>>>
{
    private readonly AppDbContext _db;
    public GetAllUsersHandler(AppDbContext db) => _db = db;

    public async Task<Result<List<UserDto>>> Handle(GetAllUsersQuery request, CancellationToken ct)
    {
        var users = await _db.Users
            .Select(u => new UserDto(u.Id, u.FullName, u.Email, u.Role, u.Avatar))
            .ToListAsync(ct);
        return Result<List<UserDto>>.Success(users);
    }
}

// ── Get User by ID ──
public record GetUserByIdQuery(int Id) : IRequest<Result<UserDto>>;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, Result<UserDto>>
{
    private readonly AppDbContext _db;
    public GetUserByIdHandler(AppDbContext db) => _db = db;

    public async Task<Result<UserDto>> Handle(GetUserByIdQuery request, CancellationToken ct)
    {
        var user = await _db.Users
            .Where(u => u.Id == request.Id)
            .Select(u => new UserDto(u.Id, u.FullName, u.Email, u.Role, u.Avatar))
            .FirstOrDefaultAsync(ct);

        return user is null
            ? Result<UserDto>.NotFound("User not found")
            : Result<UserDto>.Success(user);
    }
}

// ── Update User (admin) ──
public record UpdateUserCommand(int Id, string FullName, string Email, string? Avatar, string? Role, string CallerRole)
    : IRequest<Result<UserDto>>;

public class UpdateUserValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, Result<UserDto>>
{
    private readonly AppDbContext _db;
    public UpdateUserHandler(AppDbContext db) => _db = db;

    public async Task<Result<UserDto>> Handle(UpdateUserCommand request, CancellationToken ct)
    {
        if (request.CallerRole != "admin")
            return Result<UserDto>.Forbidden("Access denied");

        var user = await _db.Users.FindAsync(new object[] { request.Id }, ct);
        if (user is null)
            return Result<UserDto>.NotFound("User not found");

        user.FullName = request.FullName;
        user.Email = request.Email;
        if (request.Avatar is not null) user.Avatar = request.Avatar;
        if (request.Role is not null) user.Role = request.Role;

        await _db.SaveChangesAsync(ct);
        return Result<UserDto>.Success(new UserDto(user.Id, user.FullName, user.Email, user.Role, user.Avatar));
    }
}

// ── Update User Info (self) ──
public record UpdateUserInfoCommand(int Id, string FullName, string Email) : IRequest<Result<UserDto>>;

public class UpdateUserInfoValidator : AbstractValidator<UpdateUserInfoCommand>
{
    public UpdateUserInfoValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}

public class UpdateUserInfoHandler : IRequestHandler<UpdateUserInfoCommand, Result<UserDto>>
{
    private readonly AppDbContext _db;
    public UpdateUserInfoHandler(AppDbContext db) => _db = db;

    public async Task<Result<UserDto>> Handle(UpdateUserInfoCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync(new object[] { request.Id }, ct);
        if (user is null)
            return Result<UserDto>.NotFound("User not found");

        user.FullName = request.FullName;
        user.Email = request.Email;
        await _db.SaveChangesAsync(ct);

        return Result<UserDto>.Success(new UserDto(user.Id, user.FullName, user.Email, user.Role, user.Avatar));
    }
}

// ── Delete User (admin) ──
public record DeleteUserCommand(int Id, string CallerRole) : IRequest<Result<MessageResponse>>;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, Result<MessageResponse>>
{
    private readonly AppDbContext _db;
    public DeleteUserHandler(AppDbContext db) => _db = db;

    public async Task<Result<MessageResponse>> Handle(DeleteUserCommand request, CancellationToken ct)
    {
        if (request.CallerRole != "admin")
            return Result<MessageResponse>.Forbidden("Access denied");

        var user = await _db.Users.FindAsync(new object[] { request.Id }, ct);
        if (user is null)
            return Result<MessageResponse>.NotFound("User not found");

        _db.Users.Remove(user);
        await _db.SaveChangesAsync(ct);
        return Result<MessageResponse>.Success(new MessageResponse("User deleted successfully"));
    }
}

// ── Change Password ──
public record ChangePasswordCommand(int UserId, string OldPassword, string NewPassword) : IRequest<Result<MessageResponse>>;

public class ChangePasswordValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.OldPassword).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
    }
}

public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand, Result<MessageResponse>>
{
    private readonly AppDbContext _db;
    public ChangePasswordHandler(AppDbContext db) => _db = db;

    public async Task<Result<MessageResponse>> Handle(ChangePasswordCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync(new object[] { request.UserId }, ct);
        if (user is null)
            return Result<MessageResponse>.NotFound("User not found");

        if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password))
            return Result<MessageResponse>.Failure("Current password is incorrect", 400);

        user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 10);
        await _db.SaveChangesAsync(ct);
        return Result<MessageResponse>.Success(new MessageResponse("Password changed successfully"));
    }
}

// ── Upload Avatar ──
public record UploadAvatarCommand(int UserId, byte[] FileBytes) : IRequest<Result<UserDto>>;

public class UploadAvatarHandler : IRequestHandler<UploadAvatarCommand, Result<UserDto>>
{
    private readonly AppDbContext _db;
    public UploadAvatarHandler(AppDbContext db) => _db = db;

    public async Task<Result<UserDto>> Handle(UploadAvatarCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync(new object[] { request.UserId }, ct);
        if (user is null)
            return Result<UserDto>.NotFound("User not found");

        user.Avatar = Convert.ToBase64String(request.FileBytes);
        await _db.SaveChangesAsync(ct);

        return Result<UserDto>.Success(new UserDto(user.Id, user.FullName, user.Email, user.Role, user.Avatar));
    }
}
