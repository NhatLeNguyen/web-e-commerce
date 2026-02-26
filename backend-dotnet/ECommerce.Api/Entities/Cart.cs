namespace ECommerce.Api.Entities;

public class Cart : BaseEntity
{
    public int UserId { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
