using System.Text.Json;

namespace ECommerce.Api.Features.Products;

public record ProductDto(
    int Id, string Name, string Brand, string Category,
    decimal Price, int Stock, List<string> Images, string? Size,
    double AverageRating, RacketDetailDto? RacketDetails,
    List<ReviewDto> Reviews);

public record RacketDetailDto(
    string Flexibility, string FrameMaterial, string ShaftMaterial,
    string Weight, string GripSize, string MaxTension,
    string BalancePoint, string Color, string MadeIn);

public record ReviewDto(int Id, int? UserId, string Username, int Rating, string Comment, DateTime Date);

public record CreateProductRequest(
    string Name, string Brand, string Category,
    decimal Price, int Stock, List<string> Images,
    RacketDetailDto? RacketDetails, string? Size);

public record UpdateProductRequest(
    string Name, string Brand, string Category,
    decimal Price, int Stock, List<string> Images,
    RacketDetailDto? RacketDetails, string? Size);

public record AddReviewRequest(int Rating, string Comment);
