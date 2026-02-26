namespace ECommerce.Api.Features.Orders;

public record OrderItemDto(int Id, int ProductId, string Name, decimal Price, string? Size, string? ImageUrl);

public record OrderDto(
    int Id, int UserId, string Name, int Status, string? TxnRef,
    string Email, string Phone, string Address, string? Note,
    DateTime OrderTime, decimal TotalAmount, string PaymentMethod,
    List<OrderItemDto> Products);

public record CreateOrderRequest(
    int UserId, string Name, string Email, string Phone,
    string Address, string? Note, string PaymentMethod,
    List<CreateOrderItemRequest> Products, decimal TotalAmount,
    DateTime OrderTime, int? Status);

public record CreateOrderItemRequest(int ProductId, string Name, decimal Price, string? Size, string? ImageUrl);

public record UpdateOrderStatusRequest(int Status);
