using System.Security.Claims;
using ECommerce.Api.Common.Models;
using ECommerce.Api.Data;
using ECommerce.Api.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Features.Orders;

// ── Create Order ──
public record CreateOrderCommand(
    int UserId, string Name, string Email, string Phone,
    string Address, string? Note, string PaymentMethod,
    List<CreateOrderItemRequest> Products, decimal TotalAmount,
    DateTime OrderTime, int? Status) : IRequest<Result<OrderDto>>;

public class CreateOrderValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Phone).NotEmpty();
        RuleFor(x => x.Address).NotEmpty();
        RuleFor(x => x.PaymentMethod).NotEmpty();
        RuleFor(x => x.Products).NotEmpty();
        RuleFor(x => x.TotalAmount).GreaterThan(0);
    }
}

public class CreateOrderHandler(AppDbContext db) : IRequestHandler<CreateOrderCommand, Result<OrderDto>>
{
    public async Task<Result<OrderDto>> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        var order = new Order
        {
            UserId = request.UserId,
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Address = request.Address,
            Note = request.Note,
            PaymentMethod = request.PaymentMethod,
            TotalAmount = request.TotalAmount,
            OrderTime = request.OrderTime,
            Status = request.Status ?? 0,
        };

        foreach (var item in request.Products)
        {
            order.Products.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Name = item.Name,
                Price = item.Price,
                Size = item.Size,
                ImageUrl = item.ImageUrl,
            });
        }

        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);

        return Result<OrderDto>.Success(MapToDto(order), 201);
    }

    internal static OrderDto MapToDto(Order o) => new(
        o.Id, o.UserId, o.Name, o.Status, o.TxnRef,
        o.Email, o.Phone, o.Address, o.Note,
        o.OrderTime, o.TotalAmount, o.PaymentMethod,
        o.Products.Select(p => new OrderItemDto(p.Id, p.ProductId, p.Name, p.Price, p.Size, p.ImageUrl)).ToList()
    );
}

// ── Get All Orders ──
public record GetOrdersQuery : IRequest<Result<List<OrderDto>>>;

public class GetOrdersHandler(AppDbContext db) : IRequestHandler<GetOrdersQuery, Result<List<OrderDto>>>
{
    public async Task<Result<List<OrderDto>>> Handle(GetOrdersQuery request, CancellationToken ct)
    {
        var orders = await db.Orders
            .Include(o => o.Products)
            .OrderByDescending(o => o.OrderTime)
            .ToListAsync(ct);

        return Result<List<OrderDto>>.Success(orders.Select(CreateOrderHandler.MapToDto).ToList());
    }
}

// ── Get Orders by User ──
public record GetOrdersByUserQuery(int UserId) : IRequest<Result<List<OrderDto>>>;

public class GetOrdersByUserHandler(AppDbContext db) : IRequestHandler<GetOrdersByUserQuery, Result<List<OrderDto>>>
{
    public async Task<Result<List<OrderDto>>> Handle(GetOrdersByUserQuery request, CancellationToken ct)
    {
        var orders = await db.Orders
            .Include(o => o.Products)
            .Where(o => o.UserId == request.UserId)
            .OrderByDescending(o => o.OrderTime)
            .ToListAsync(ct);

        return Result<List<OrderDto>>.Success(orders.Select(CreateOrderHandler.MapToDto).ToList());
    }
}

// ── Update Order Status (role-based) ──
public record UpdateOrderStatusCommand(int OrderId, int Status, string UserRole, int UserId) : IRequest<Result<OrderDto>>;

public class UpdateOrderStatusHandler(AppDbContext db) : IRequestHandler<UpdateOrderStatusCommand, Result<OrderDto>>
{
    public async Task<Result<OrderDto>> Handle(UpdateOrderStatusCommand request, CancellationToken ct)
    {
        var order = await db.Orders
            .Include(o => o.Products)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, ct);

        if (order is null)
            return Result<OrderDto>.NotFound("Order not found");

        // Role-based status update (matching Node.js logic exactly)
        if (request.UserRole == "admin")
        {
            if (request.Status == 1 || request.Status == 2)
                order.Status = request.Status;
            else
                return Result<OrderDto>.Failure("Invalid status for admin", 400);
        }
        else if (request.UserRole == "guest")
        {
            if (request.Status == 3)
                order.Status = request.Status;
            else
                return Result<OrderDto>.Forbidden("Unauthorized action for guest");
        }
        else
        {
            return Result<OrderDto>.Forbidden("Unauthorized role");
        }

        await db.SaveChangesAsync(ct);
        return Result<OrderDto>.Success(CreateOrderHandler.MapToDto(order));
    }
}
