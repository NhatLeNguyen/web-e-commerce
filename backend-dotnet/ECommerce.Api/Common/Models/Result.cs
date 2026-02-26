namespace ECommerce.Api.Common.Models;

public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }
    public int StatusCode { get; }

    private Result(bool isSuccess, T? value, string? error, int statusCode)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
        StatusCode = statusCode;
    }

    public static Result<T> Success(T value, int statusCode = 200)
        => new(true, value, null, statusCode);

    public static Result<T> Failure(string error, int statusCode = 400)
        => new(false, default, error, statusCode);

    public static Result<T> NotFound(string error = "Resource not found")
        => new(false, default, error, 404);

    public static Result<T> Unauthorized(string error = "Unauthorized")
        => new(false, default, error, 401);

    public static Result<T> Forbidden(string error = "Forbidden")
        => new(false, default, error, 403);
}

public class Result
{
    public bool IsSuccess { get; }
    public string? Error { get; }
    public int StatusCode { get; }

    private Result(bool isSuccess, string? error, int statusCode)
    {
        IsSuccess = isSuccess;
        Error = error;
        StatusCode = statusCode;
    }

    public static Result Success(int statusCode = 200) => new(true, null, statusCode);
    public static Result Failure(string error, int statusCode = 400) => new(false, error, statusCode);
}

// Simple message result for endpoints that return only a message
public record MessageResponse(string Message);
