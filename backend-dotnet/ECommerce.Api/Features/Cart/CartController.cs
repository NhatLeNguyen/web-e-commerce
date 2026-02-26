using ECommerce.Api.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Features.Cart;

[Authorize]
[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;
    public CartController(IMediator mediator) => _mediator = mediator;

    /// <summary>Get user's cart</summary>
    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        var result = await _mediator.Send(new GetCartQuery(userId));
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Add item to cart</summary>
    [HttpPost("{userId:int}")]
    public async Task<IActionResult> AddToCart(int userId, [FromBody] AddToCartBody body)
    {
        var command = new AddToCartCommand(userId, body.ProductId, body.Name, body.Price, body.Quantity, body.Size, body.ImageUrl);
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Remove item from cart</summary>
    [HttpDelete("{userId:int}/{productId:int}")]
    public async Task<IActionResult> RemoveFromCart(int userId, int productId, [FromBody] RemoveFromCartBody? body)
    {
        var command = new RemoveFromCartCommand(userId, productId, body?.Size);
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }
}

public record AddToCartBody(int ProductId, string Name, decimal Price, int Quantity, string? Size, string ImageUrl);
public record RemoveFromCartBody(string? Size);
