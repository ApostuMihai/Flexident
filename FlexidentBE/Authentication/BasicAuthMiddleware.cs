using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Flexident.Data;

public class BasicAuthMiddleware
{
    private readonly RequestDelegate _next;

    public BasicAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        if (!context.Request.Headers.ContainsKey("Authorization"))
        {
            context.Response.StatusCode = 401; // Unauthorized
            return;
        }

        var authHeader = context.Request.Headers["Authorization"].ToString();
        if (authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
        {
            var token = authHeader.Substring("Basic ".Length).Trim();
            var credentials = Encoding.UTF8.GetString(Convert.FromBase64String(token)).Split(':');
            var username = credentials[0];
            var password = credentials[1];

            var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                context.Items["User"] = user;
                await _next(context);
                return;
            }
        }

        context.Response.StatusCode = 401; // Unauthorized
    }
}