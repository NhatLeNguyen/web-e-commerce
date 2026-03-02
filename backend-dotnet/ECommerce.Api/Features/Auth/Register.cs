using ECommerce.Api.Common.Models;
using ECommerce.Api.Data;
using ECommerce.Api.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Features.Auth;

// ── Command ──
public record RegisterCommand(string FullName, string Email, string Password, string? Role) : IRequest<Result<AuthUserDto>>;

// ── Validator ──
public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(200);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.Role).Must(r => r == null || r == "guest" || r == "admin")
            .WithMessage("Role must be 'guest' or 'admin'");
    }
}

// ── Handler ──
public class RegisterHandler(AppDbContext db) : IRequestHandler<RegisterCommand, Result<AuthUserDto>>
{
    public async Task<Result<AuthUserDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await db.Users
            .AnyAsync(u => u.Email == request.Email, cancellationToken);

        if (existingUser)
            return Result<AuthUserDto>.Failure("User already exists", 400);

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            Password = hashedPassword,
            Role = request.Role ?? "guest"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(cancellationToken);

        var dto = new AuthUserDto(user.Id, user.FullName, user.Email, user.Role, user.Avatar);
        return Result<AuthUserDto>.Success(dto, 201);
    }
}
