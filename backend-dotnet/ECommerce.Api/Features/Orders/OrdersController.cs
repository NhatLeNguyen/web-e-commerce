using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Features.Orders;

[Authorize]
[ApiController]
[Route("api/orders")]
public class OrdersController(IMediator mediator) : ControllerBase
{
    /// <summary>Create a new order</summary>
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var command = new CreateOrderCommand(
            request.UserId, request.Name, request.Email, request.Phone,
            request.Address, request.Note, request.PaymentMethod,
            request.Products, request.TotalAmount, request.OrderTime, request.Status);
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? StatusCode(result.StatusCode, result.Value)
            : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Get all orders</summary>
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var result = await mediator.Send(new GetOrdersQuery());
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Get orders by user ID</summary>
    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetOrdersByUser(int userId)
    {
        var result = await mediator.Send(new GetOrdersByUserQuery(userId));
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Update order status (role-based)</summary>
    [HttpPatch("{orderId:int}")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "guest";
        var userId = int.TryParse(User.FindFirst("id")?.Value, out var uid) ? uid : 0;
        var command = new UpdateOrderStatusCommand(orderId, request.Status, role, userId);
        var result = await mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }
}
