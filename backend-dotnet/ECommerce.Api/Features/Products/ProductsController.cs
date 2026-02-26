using System.Security.Claims;
using ECommerce.Api.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Features.Products;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProductsController(IMediator mediator) => _mediator = mediator;

    /// <summary>Get all products (optional ?category= filter)</summary>
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] string? category)
    {
        var result = await _mediator.Send(new GetProductsQuery(category));
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Get product by ID</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Create a new product</summary>
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var command = new CreateProductCommand(
            request.Name, request.Brand, request.Category,
            request.Price, request.Stock, request.Images,
            request.RacketDetails, request.Size);
        var result = await _mediator.Send(command);
        return result.IsSuccess
            ? StatusCode(result.StatusCode, result.Value)
            : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Update product by ID</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        var command = new UpdateProductCommand(
            id, request.Name, request.Brand, request.Category,
            request.Price, request.Stock, request.Images,
            request.RacketDetails, request.Size);
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Delete product by ID</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await _mediator.Send(new DeleteProductCommand(id));
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { message = result.Error });
    }

    /// <summary>Add a review to a product (requires auth)</summary>
    [Authorize]
    [HttpPost("{id:int}/reviews")]
    public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewRequest request)
    {
        var userId = int.TryParse(User.FindFirst("id")?.Value, out var uid) ? uid : (int?)null;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var command = new AddReviewCommand(id, userId, email, request.Rating, request.Comment);
        var result = await _mediator.Send(command);
        return result.IsSuccess
            ? StatusCode(result.StatusCode, new { message = "Review added successfully", review = result.Value })
            : StatusCode(result.StatusCode, new { message = result.Error });
    }
}
