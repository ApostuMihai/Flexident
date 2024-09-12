using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Flexident;
using Flexident.Data;
using Flexident.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public TokenService(IConfiguration configuration, ApplicationDbContext context)
    {
        _configuration = configuration;
        _context = context;
    }

    public async Task<string> ValidateUser(string username, string password)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            return null;
        }

        return GenerateToken(user);
    }

    public string GenerateToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt").Get<JwtSettings>();
        var key = Encoding.UTF8.GetBytes(jwtSettings.Key);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, jwtSettings.Subject),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim("id", user.UserId.ToString()),  // User ID claim
                new Claim("username", user.Username),    // Username claim
                new Claim("userRole", user.UserRole.ToString())  // Adding userRole to the token
            }),
            Expires = DateTime.UtcNow.AddMinutes(jwtSettings.ExpiresInMinutes),
            Issuer = jwtSettings.Issuer,
            Audience = jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
