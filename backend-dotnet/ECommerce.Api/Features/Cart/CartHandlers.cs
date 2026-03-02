using ECommerce.Api.Common.Models;
using ECommerce.Api.Data;
using ECommerce.Api.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Features.Cart;

// ── Get Cart ──
public record GetCartQuery(int UserId) : IRequest<Result<List<CartItemDto>>>;

public class GetCartHandler(AppDbContext db) : IRequestHandler<GetCartQuery, Result<List<CartItemDto>>>
{
    public async Task<Result<List<CartItemDto>>> Handle(GetCartQuery request, CancellationToken ct)
    {
        var cart = await db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == request.UserId, ct);

        if (cart is null)
            return Result<List<CartItemDto>>.NotFound("Cart not found");

        var items = cart.Items.Select(i => new CartItemDto(
            i.Id, i.ProductId, i.Name, i.Price, i.Quantity, i.Size, i.ImageUrl
        )).ToList();

        return Result<List<CartItemDto>>.Success(items);
    }
}

// ── Add Item to Cart ──
public record AddToCartCommand(
    int UserId, int ProductId, string Name, decimal Price,
    int Quantity, string? Size, string ImageUrl) : IRequest<Result<List<CartItemDto>>>;

public class AddToCartValidator : AbstractValidator<AddToCartCommand>
{
    public AddToCartValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.ProductId).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.ImageUrl).NotEmpty();
    }
}

public class AddToCartHandler(AppDbContext db) : IRequestHandler<AddToCartCommand, Result<List<CartItemDto>>>
{
    public async Task<Result<List<CartItemDto>>> Handle(AddToCartCommand request, CancellationToken ct)
    {
        var cart = await db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == request.UserId, ct);

        if (cart is null)
        {
            cart = new Entities.Cart { UserId = request.UserId };
            db.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(
            i => i.ProductId == request.ProductId && i.Size == request.Size);

        if (existingItem is not null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                ProductId = request.ProductId,
                Name = request.Name,
                Price = request.Price,
                Quantity = request.Quantity,
                Size = request.Size,
                ImageUrl = request.ImageUrl,
            });
        }

        await db.SaveChangesAsync(ct);

        var items = cart.Items.Select(i => new CartItemDto(
            i.Id, i.ProductId, i.Name, i.Price, i.Quantity, i.Size, i.ImageUrl
        )).ToList();

        return Result<List<CartItemDto>>.Success(items);
    }
}

// ── Remove Item from Cart ──
public record RemoveFromCartCommand(int UserId, int ProductId, string? Size) : IRequest<Result<List<CartItemDto>>>;

public class RemoveFromCartHandler(AppDbContext db) : IRequestHandler<RemoveFromCartCommand, Result<List<CartItemDto>>>
{
    public async Task<Result<List<CartItemDto>>> Handle(RemoveFromCartCommand request, CancellationToken ct)
    {
        var cart = await db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == request.UserId, ct);

        if (cart is null)
            return Result<List<CartItemDto>>.NotFound("Cart not found");

        var itemToRemove = cart.Items.FirstOrDefault(
            i => i.ProductId == request.ProductId && i.Size == request.Size);

        if (itemToRemove is not null)
        {
            cart.Items.Remove(itemToRemove);
            await db.SaveChangesAsync(ct);
        }

        var items = cart.Items.Select(i => new CartItemDto(
            i.Id, i.ProductId, i.Name, i.Price, i.Quantity, i.Size, i.ImageUrl
        )).ToList();

        return Result<List<CartItemDto>>.Success(items);
    }
}
