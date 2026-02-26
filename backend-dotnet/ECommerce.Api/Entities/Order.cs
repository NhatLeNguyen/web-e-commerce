namespace ECommerce.Api.Entities;

public class Order : BaseEntity
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Status { get; set; } = 0; // 0=Pending, 1=Confirmed, 2=Shipping, 3=Delivered, -2=Failed
    public string? TxnRef { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Note { get; set; }
    public DateTime OrderTime { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;

    // Navigation
    public User User { get; set; } = null!;
    public ICollection<OrderItem> Products { get; set; } = new List<OrderItem>();
}
