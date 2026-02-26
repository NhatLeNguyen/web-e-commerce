using System.Text.Json;
using ECommerce.Api.Common.Models;
using ECommerce.Api.Data;
using ECommerce.Api.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Features.Products;

// ── Create Product ──
public record CreateProductCommand(
    string Name, string Brand, string Category,
    decimal Price, int Stock, List<string> Images,
    RacketDetailDto? RacketDetails, string? Size) : IRequest<Result<ProductDto>>;

public class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    private static readonly string[] ValidCategories = { "racket", "shoes", "shorts", "shirt", "skirt", "racket-bag", "backpack", "accessory" };
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Brand).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Category).NotEmpty().Must(c => ValidCategories.Contains(c))
            .WithMessage("Invalid category");
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Stock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Images).NotEmpty();
    }
}

public class CreateProductHandler : IRequestHandler<CreateProductCommand, Result<ProductDto>>
{
    private readonly AppDbContext _db;
    public CreateProductHandler(AppDbContext db) => _db = db;

    public async Task<Result<ProductDto>> Handle(CreateProductCommand request, CancellationToken ct)
    {
        var product = new Product
        {
            Name = request.Name,
            Brand = request.Brand,
            Category = request.Category,
            Price = request.Price,
            Stock = request.Stock,
            Images = JsonSerializer.Serialize(request.Images),
            Size = request.Category != "racket" ? request.Size : null,
        };

        if (request.Category == "racket" && request.RacketDetails is not null)
        {
            product.RacketDetail = new RacketDetail
            {
                Flexibility = request.RacketDetails.Flexibility,
                FrameMaterial = request.RacketDetails.FrameMaterial,
                ShaftMaterial = request.RacketDetails.ShaftMaterial,
                Weight = request.RacketDetails.Weight,
                GripSize = request.RacketDetails.GripSize,
                MaxTension = request.RacketDetails.MaxTension,
                BalancePoint = request.RacketDetails.BalancePoint,
                Color = request.RacketDetails.Color,
                MadeIn = request.RacketDetails.MadeIn,
            };
        }

        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);

        return Result<ProductDto>.Success(MapToDto(product), 201);
    }

    internal static ProductDto MapToDto(Product p)
    {
        var images = new List<string>();
        try { images = JsonSerializer.Deserialize<List<string>>(p.Images) ?? new(); } catch { }

        return new ProductDto(
            p.Id, p.Name, p.Brand, p.Category, p.Price, p.Stock, images, p.Size, p.AverageRating,
            p.RacketDetail is not null ? new RacketDetailDto(
                p.RacketDetail.Flexibility, p.RacketDetail.FrameMaterial, p.RacketDetail.ShaftMaterial,
                p.RacketDetail.Weight, p.RacketDetail.GripSize, p.RacketDetail.MaxTension,
                p.RacketDetail.BalancePoint, p.RacketDetail.Color, p.RacketDetail.MadeIn) : null,
            p.Reviews.Select(r => new ReviewDto(r.Id, r.UserId, r.Username, r.Rating, r.Comment, r.Date)).ToList()
        );
    }
}

// ── Get Products (with optional category filter) ──
public record GetProductsQuery(string? Category) : IRequest<Result<List<ProductDto>>>;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, Result<List<ProductDto>>>
{
    private readonly AppDbContext _db;
    public GetProductsHandler(AppDbContext db) => _db = db;

    public async Task<Result<List<ProductDto>>> Handle(GetProductsQuery request, CancellationToken ct)
    {
        var query = _db.Products
            .Include(p => p.RacketDetail)
            .Include(p => p.Reviews)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Category))
            query = query.Where(p => p.Category == request.Category);

        var products = await query.ToListAsync(ct);
        var dtos = products.Select(CreateProductHandler.MapToDto).ToList();
        return Result<List<ProductDto>>.Success(dtos);
    }
}

// ── Get Product by ID ──
public record GetProductByIdQuery(int Id) : IRequest<Result<ProductDto>>;

public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, Result<ProductDto>>
{
    private readonly AppDbContext _db;
    public GetProductByIdHandler(AppDbContext db) => _db = db;

    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken ct)
    {
        var product = await _db.Products
            .Include(p => p.RacketDetail)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == request.Id, ct);

        if (product is null)
            return Result<ProductDto>.NotFound("Product not found");

        return Result<ProductDto>.Success(CreateProductHandler.MapToDto(product));
    }
}

// ── Update Product ──
public record UpdateProductCommand(
    int Id, string Name, string Brand, string Category,
    decimal Price, int Stock, List<string> Images,
    RacketDetailDto? RacketDetails, string? Size) : IRequest<Result<ProductDto>>;

public class UpdateProductValidator : AbstractValidator<UpdateProductCommand>
{
    private static readonly string[] ValidCategories = { "racket", "shoes", "shorts", "shirt", "skirt", "racket-bag", "backpack", "accessory" };
    public UpdateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Brand).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Category).NotEmpty().Must(c => ValidCategories.Contains(c));
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Stock).GreaterThanOrEqualTo(0);
    }
}

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Result<ProductDto>>
{
    private readonly AppDbContext _db;
    public UpdateProductHandler(AppDbContext db) => _db = db;

    public async Task<Result<ProductDto>> Handle(UpdateProductCommand request, CancellationToken ct)
    {
        var product = await _db.Products
            .Include(p => p.RacketDetail)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == request.Id, ct);

        if (product is null)
            return Result<ProductDto>.NotFound("Product not found");

        product.Name = request.Name;
        product.Brand = request.Brand;
        product.Category = request.Category;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.Images = JsonSerializer.Serialize(request.Images);
        product.Size = request.Category != "racket" ? request.Size : null;

        if (request.Category == "racket" && request.RacketDetails is not null)
        {
            if (product.RacketDetail is null)
                product.RacketDetail = new RacketDetail();

            product.RacketDetail.Flexibility = request.RacketDetails.Flexibility;
            product.RacketDetail.FrameMaterial = request.RacketDetails.FrameMaterial;
            product.RacketDetail.ShaftMaterial = request.RacketDetails.ShaftMaterial;
            product.RacketDetail.Weight = request.RacketDetails.Weight;
            product.RacketDetail.GripSize = request.RacketDetails.GripSize;
            product.RacketDetail.MaxTension = request.RacketDetails.MaxTension;
            product.RacketDetail.BalancePoint = request.RacketDetails.BalancePoint;
            product.RacketDetail.Color = request.RacketDetails.Color;
            product.RacketDetail.MadeIn = request.RacketDetails.MadeIn;
        }
        else if (product.RacketDetail is not null)
        {
            _db.RacketDetails.Remove(product.RacketDetail);
        }

        await _db.SaveChangesAsync(ct);
        return Result<ProductDto>.Success(CreateProductHandler.MapToDto(product));
    }
}

// ── Delete Product ──
public record DeleteProductCommand(int Id) : IRequest<Result<MessageResponse>>;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, Result<MessageResponse>>
{
    private readonly AppDbContext _db;
    public DeleteProductHandler(AppDbContext db) => _db = db;

    public async Task<Result<MessageResponse>> Handle(DeleteProductCommand request, CancellationToken ct)
    {
        var product = await _db.Products.FindAsync(new object[] { request.Id }, ct);
        if (product is null)
            return Result<MessageResponse>.NotFound("Product not found");

        _db.Products.Remove(product);
        await _db.SaveChangesAsync(ct);
        return Result<MessageResponse>.Success(new MessageResponse("Product deleted successfully"));
    }
}

// ── Add Review ──
public record AddReviewCommand(int ProductId, int? UserId, string? UserEmail, int Rating, string Comment) : IRequest<Result<ReviewDto>>;

public class AddReviewValidator : AbstractValidator<AddReviewCommand>
{
    public AddReviewValidator()
    {
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Comment).NotEmpty();
    }
}

public class AddReviewHandler : IRequestHandler<AddReviewCommand, Result<ReviewDto>>
{
    private readonly AppDbContext _db;
    public AddReviewHandler(AppDbContext db) => _db = db;

    public async Task<Result<ReviewDto>> Handle(AddReviewCommand request, CancellationToken ct)
    {
        var product = await _db.Products
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == request.ProductId, ct);

        if (product is null)
            return Result<ReviewDto>.NotFound("Product not found");

        var review = new Review
        {
            ProductId = request.ProductId,
            UserId = request.UserId,
            Username = request.UserEmail ?? "Anonymous",
            Rating = request.Rating,
            Comment = request.Comment,
            Date = DateTime.UtcNow,
        };

        product.Reviews.Add(review);

        // Recalculate average
        product.AverageRating = product.Reviews.Average(r => r.Rating);

        await _db.SaveChangesAsync(ct);

        var dto = new ReviewDto(review.Id, review.UserId, review.Username, review.Rating, review.Comment, review.Date);
        return Result<ReviewDto>.Success(dto, 201);
    }
}
