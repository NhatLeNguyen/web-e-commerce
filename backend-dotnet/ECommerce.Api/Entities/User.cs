namespace ECommerce.Api.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "guest";
    public string Avatar { get; set; } = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwmN2B5ZtIWxid1qvHQiEHKisZirAA7fcBDg&s";
    public string? ResetPasswordToken { get; set; }
    public DateTime? ResetPasswordExpires { get; set; }

    // Navigation
    public ICollection<Cart> Carts { get; set; } = new List<Cart>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
