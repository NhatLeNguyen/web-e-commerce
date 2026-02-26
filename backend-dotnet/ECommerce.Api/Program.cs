using System.Text;
using System.Threading.RateLimiting;
using ECommerce.Api.Common.Behaviors;
using ECommerce.Api.Common.Exceptions;
using ECommerce.Api.Data;
using ECommerce.Api.Data.Seeding;
using ECommerce.Api.Middleware;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog ──
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .CreateLogger();
builder.Host.UseSerilog();

// ── EF Core + MySQL (Oracle MySql.EntityFrameworkCore) ──
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString!));

// ── MediatR + Pipeline ──
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// ── FluentValidation ──
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// ── JWT Authentication ──
var jwtSecret = builder.Configuration["Jwt:Secret"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
    };
});
builder.Services.AddAuthorization();

// ── CORS ──
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:5173" };
        policy.WithOrigins(origins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ── Rate Limiting ──
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 10,
            }));
});

// ── OpenAPI (native .NET 10) + Swagger UI ──
builder.Services.AddOpenApi("v1", options =>
{
    options.AddDocumentTransformer((document, context, ct) =>
    {
        document.Info.Title = "E-Commerce API";
        document.Info.Version = "v1";
        document.Info.Description = "ASP.NET Core E-Commerce API — migrated from Node.js";
        return Task.CompletedTask;
    });
});

// ── Controllers ──
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

// ── Global Exception Handler ──
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// ── Middleware Pipeline ──
app.UseExceptionHandler();
app.UseMiddleware<SecurityHeadersMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();  // Serves OpenAPI doc at /openapi/v1.json
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/openapi/v1.json", "E-Commerce API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ── Database initialization ──
// Development: tự tạo bảng + seed data (tiện lợi cho dev)
// Production:  KHÔNG tự tạo — phải dùng CLI migration trước khi deploy:
//              dotnet ef migrations add <Tên>
//              dotnet ef database update
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        if (app.Environment.IsDevelopment())
        {
            // EnsureCreated: tạo bảng nếu chưa có, bỏ qua nếu đã có
            // KHÔNG ghi đè data, KHÔNG xoá bảng cũ
            var created = await db.Database.EnsureCreatedAsync();
            if (created)
                Log.Information("✅ Database tables created from EF model");
            else
                Log.Information("ℹ️ Database already exists — skipping table creation");

            await DbSeeder.SeedAsync(db);
        }
        else
        {
            // Production: chỉ kiểm tra kết nối, không tự tạo/sửa bảng
            var canConnect = await db.Database.CanConnectAsync();
            if (!canConnect)
                Log.Error("❌ Cannot connect to database! Check ConnectionStrings:DefaultConnection");
        }
    }
    catch (Exception ex)
    {
        Log.Error(ex, "❌ Database initialization failed. Is MySQL running?");
        // Không crash app — cho phép startup để health check có thể báo lỗi
    }
}

Log.Information("🚀 E-Commerce API started on {Urls}", string.Join(", ", app.Urls));
app.Run();
