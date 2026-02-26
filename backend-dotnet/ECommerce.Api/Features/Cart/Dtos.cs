namespace ECommerce.Api.Features.Cart;

public record CartItemDto(int Id, int ProductId, string Name, decimal Price, int Quantity, string? Size, string ImageUrl);
