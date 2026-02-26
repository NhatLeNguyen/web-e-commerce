using System.Text.Json;
using ECommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Data.Seeding;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Users.AnyAsync())
            return; // Already seeded

        // ── Seed Admin User ──
        var admin = new User
        {
            FullName = "Admin User",
            Email = "admin@ecommerce.com",
            Password = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12),
            Role = "admin",
        };

        var guest = new User
        {
            FullName = "Test User",
            Email = "user@ecommerce.com",
            Password = BCrypt.Net.BCrypt.HashPassword("User123!", 12),
            Role = "guest",
        };

        db.Users.AddRange(admin, guest);
        await db.SaveChangesAsync();

        // ── Seed Products ──
        var products = new List<Product>
        {
            new()
            {
                Name = "Yonex Astrox 99",
                Brand = "Yonex",
                Category = "racket",
                Price = 199.99m,
                Stock = 25,
                Images = JsonSerializer.Serialize(new[] { "https://placehold.co/400x400?text=Astrox+99" }),
                AverageRating = 4.5,
                RacketDetail = new RacketDetail
                {
                    Flexibility = "Stiff",
                    FrameMaterial = "HM Graphite",
                    ShaftMaterial = "HM Graphite + Namd",
                    Weight = "83g (4U)",
                    GripSize = "G5",
                    MaxTension = "28 lbs",
                    BalancePoint = "305mm",
                    Color = "Cherry Sunburst",
                    MadeIn = "Japan",
                },
            },
            new()
            {
                Name = "Li-Ning N7II",
                Brand = "Li-Ning",
                Category = "racket",
                Price = 149.99m,
                Stock = 15,
                Images = JsonSerializer.Serialize(new[] { "https://placehold.co/400x400?text=N7II" }),
                AverageRating = 4.2,
                RacketDetail = new RacketDetail
                {
                    Flexibility = "Medium",
                    FrameMaterial = "Carbon Fiber",
                    ShaftMaterial = "Carbon Fiber",
                    Weight = "82g (4U)",
                    GripSize = "G5",
                    MaxTension = "30 lbs",
                    BalancePoint = "300mm",
                    Color = "Blue",
                    MadeIn = "China",
                },
            },
            new()
            {
                Name = "Yonex Power Cushion 65Z",
                Brand = "Yonex",
                Category = "shoes",
                Price = 129.99m,
                Stock = 30,
                Images = JsonSerializer.Serialize(new[] { "https://placehold.co/400x400?text=PC+65Z" }),
                Size = "42",
            },
            new()
            {
                Name = "Victor Training Shorts",
                Brand = "Victor",
                Category = "shorts",
                Price = 29.99m,
                Stock = 50,
                Images = JsonSerializer.Serialize(new[] { "https://placehold.co/400x400?text=Shorts" }),
                Size = "M",
            },
            new()
            {
                Name = "Yonex Tournament Shirt",
                Brand = "Yonex",
                Category = "shirt",
                Price = 39.99m,
                Stock = 40,
                Images = JsonSerializer.Serialize(new[] { "https://placehold.co/400x400?text=Shirt" }),
                Size = "L",
            },
            new()
            {
                Name = "Li-Ning Racket Bag 6-in-1",
                Brand = "Li-Ning",
                Category = "racket-bag",
                Price = 69.99m,
                Stock = 20,
                Images = JsonSerializer.Serialize(new[] { "https://placehold.co/400x400?text=Racket+Bag" }),
            },
        };

        db.Products.AddRange(products);
        await db.SaveChangesAsync();

        Console.WriteLine("✅ Database seeded with 2 users and 6 products.");
    }
}
