using ECommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<RacketDetail> RacketDetails => Set<RacketDetail>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Global query filter for soft delete ──
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Product>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Cart>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Order>().HasQueryFilter(e => !e.IsDeleted);

        // ── User ──
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.FullName).HasMaxLength(200).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(200).IsRequired();
            entity.Property(u => u.Password).IsRequired();
            entity.Property(u => u.Role).HasMaxLength(20).HasDefaultValue("guest");
            entity.Property(u => u.Avatar).HasColumnType("longtext");
        });

        // ── Product ──
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Name).HasMaxLength(300).IsRequired();
            entity.Property(p => p.Brand).HasMaxLength(100).IsRequired();
            entity.Property(p => p.Category).HasMaxLength(50).IsRequired();
            entity.Property(p => p.Price).HasColumnType("decimal(18,2)");
            entity.Property(p => p.Images).HasColumnType("longtext");
            entity.Property(p => p.Size).HasMaxLength(50);
        });

        // ── RacketDetail ──
        modelBuilder.Entity<RacketDetail>(entity =>
        {
            entity.HasOne(r => r.Product)
                  .WithOne(p => p.RacketDetail)
                  .HasForeignKey<RacketDetail>(r => r.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(r => r.Flexibility).HasMaxLength(100);
            entity.Property(r => r.FrameMaterial).HasMaxLength(100);
            entity.Property(r => r.ShaftMaterial).HasMaxLength(100);
            entity.Property(r => r.Weight).HasMaxLength(50);
            entity.Property(r => r.GripSize).HasMaxLength(50);
            entity.Property(r => r.MaxTension).HasMaxLength(50);
            entity.Property(r => r.BalancePoint).HasMaxLength(50);
            entity.Property(r => r.Color).HasMaxLength(50);
            entity.Property(r => r.MadeIn).HasMaxLength(100);
        });

        // ── Review ──
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasOne(r => r.Product)
                  .WithMany(p => p.Reviews)
                  .HasForeignKey(r => r.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(r => r.User)
                  .WithMany(u => u.Reviews)
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.Property(r => r.Username).HasMaxLength(200);
            entity.Property(r => r.Comment).HasColumnType("text");
        });

        // ── Cart ──
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasOne(c => c.User)
                  .WithMany(u => u.Carts)
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── CartItem ──
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasOne(ci => ci.Cart)
                  .WithMany(c => c.Items)
                  .HasForeignKey(ci => ci.CartId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(ci => ci.Product)
                  .WithMany(p => p.CartItems)
                  .HasForeignKey(ci => ci.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(ci => ci.Name).HasMaxLength(300);
            entity.Property(ci => ci.Price).HasColumnType("decimal(18,2)");
            entity.Property(ci => ci.Size).HasMaxLength(50);
            entity.Property(ci => ci.ImageUrl).HasColumnType("text");
        });

        // ── Order ──
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasOne(o => o.User)
                  .WithMany(u => u.Orders)
                  .HasForeignKey(o => o.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(o => o.Name).HasMaxLength(200).IsRequired();
            entity.Property(o => o.Email).HasMaxLength(200).IsRequired();
            entity.Property(o => o.Phone).HasMaxLength(30).IsRequired();
            entity.Property(o => o.Address).HasMaxLength(500).IsRequired();
            entity.Property(o => o.Note).HasMaxLength(500);
            entity.Property(o => o.TxnRef).HasMaxLength(100);
            entity.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(o => o.PaymentMethod).HasMaxLength(50).IsRequired();
        });

        // ── OrderItem ──
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasOne(oi => oi.Order)
                  .WithMany(o => o.Products)
                  .HasForeignKey(oi => oi.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(oi => oi.Product)
                  .WithMany(p => p.OrderItems)
                  .HasForeignKey(oi => oi.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(oi => oi.Name).HasMaxLength(300);
            entity.Property(oi => oi.Price).HasColumnType("decimal(18,2)");
            entity.Property(oi => oi.Size).HasMaxLength(50);
            entity.Property(oi => oi.ImageUrl).HasColumnType("text");
        });

        // ── RefreshToken ──
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasOne(rt => rt.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(rt => rt.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(rt => rt.Token).HasMaxLength(500).IsRequired();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
