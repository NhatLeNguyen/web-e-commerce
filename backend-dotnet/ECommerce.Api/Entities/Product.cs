namespace ECommerce.Api.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Images { get; set; } = "[]"; // JSON array of image URLs/base64
    public string? Size { get; set; }
    public double AverageRating { get; set; } = 0;

    // Navigation
    public RacketDetail? RacketDetail { get; set; }
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
