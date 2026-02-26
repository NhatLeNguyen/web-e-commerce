namespace ECommerce.Api.Entities;

public class RacketDetail
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Flexibility { get; set; } = string.Empty;
    public string FrameMaterial { get; set; } = string.Empty;
    public string ShaftMaterial { get; set; } = string.Empty;
    public string Weight { get; set; } = string.Empty;
    public string GripSize { get; set; } = string.Empty;
    public string MaxTension { get; set; } = string.Empty;
    public string BalancePoint { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string MadeIn { get; set; } = string.Empty;

    // Navigation
    public Product Product { get; set; } = null!;
}
