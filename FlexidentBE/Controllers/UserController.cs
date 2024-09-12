using Flexident.Data;
using Flexident.DTOs;
using Flexident.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Flexident.Controllers;

public class UserController : Controller
{
    private readonly ApplicationDbContext _db;
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(ApplicationDbContext db, ITokenService tokenService, IUserService userService, ILogger<UserController> logger)
    {
        _db = db;
        _userService = userService;
        _tokenService = tokenService;
        _logger = logger;
    }
    [HttpGet]
    [Route("users")]
    [Authorize]
    public async Task<IActionResult> GetUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            // Calculate the number of items to skip
            var skip = (pageNumber - 1) * pageSize;

            // Fetch users from the database with pagination
            var users = await _db.Users
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var totalUsers = await _db.Users.CountAsync(); // Get the total number of users

            var usersDto = users.Select(u => new UserDto
            {
                UserId = u.UserId,
                Email = u.Email,
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                BirthDate = u.BirthDate,
                Phone = u.Phone,
                UserRole = (int)u.UserRole, // Convert enum to int
                Specializare = (int)u.Specializare, // Convert enum to int
                Description = u.Description,
                ContActiv = u.ContActiv,
                LastLogin = u.LastLogin
            }).ToList();

            // Return both the total count and the users data
            var result = new
            {
                TotalCount = totalUsers,
                Users = usersDto
            };

            return Ok(result);
        }
        catch (Exception e)
        {
            return StatusCode(500, "An error has occurred while trying to retrieve the users: " + e.Message);
        }
    }

    [HttpGet]
    [Route("users/{id}")]
    [Authorize]
    public async Task<IActionResult> GetUser(int id)
    {
        try
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            var filteredUser = new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                BirthDate = user.BirthDate,
                Phone = user.Phone,
                UserRole = (int)user.UserRole, // Convert enum to int
                Specializare = (int)user.Specializare, // Convert enum to int
                Description = user.Description,
                ContActiv = user.ContActiv,
                LastLogin = user.LastLogin
            };
            return Ok(filteredUser);
        }
        catch (Exception e)
        {
            return StatusCode(500, "An error occurred while trying to retrieve the user: " + e.Message);
        }
    }

    
    
    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] UserDto userDto)
    {
        try
        {
            if (userDto == null)
            {
                return BadRequest("User data is null.");
            }

            // Check if the email already exists
            var existingUserByEmail = await _db.Users.SingleOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUserByEmail != null)
            {
                return BadRequest("Email already in use.");
            }

            // Check if the username already exists
            var existingUserByUsername = await _db.Users.SingleOrDefaultAsync(u => u.Username == userDto.Username);
            if (existingUserByUsername != null)
            {
                return BadRequest("Username already in use.");
            }

            if (!Enum.IsDefined(typeof(UserRole), userDto.UserRole))
            {
                return BadRequest("Invalid UserRole.");
            }

            if (!Enum.IsDefined(typeof(Specializare), userDto.Specializare))
            {
                return BadRequest("Invalid Specializare.");
            }

            var user = new User
            {
                Email = userDto.Email,
                Username = userDto.Username,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                BirthDate = userDto.BirthDate,
                Phone = userDto.Phone,
                UserRole = (UserRole)userDto.UserRole,
                ContActiv = false, 
                LastLogin = DateTime.UtcNow,
                Description = "No description yet",
                Specializare = Specializare.None,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password) 
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
        {
            // Return a JSON object with an error message
            return Unauthorized(new { message = "Invalid credentials." });
        }

        // Check if the user account is inactive
        if (!user.ContActiv)
        {
            // Return a JSON object with a specific message for inactive users
            return BadRequest(new { message = "Your account is inactive. Please contact support." });
        }

        // If everything is valid, generate the token
        var token = _tokenService.GenerateToken(user);

        // Update the LastLogin field
        user.LastLogin = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // Return the token as JSON
        return Ok(new { token = token });
    }

    [HttpGet]
    [Route("users/me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized("User not authorized.");
        }

        int userId = int.Parse(userIdClaim);
        var user = await _db.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        var userDto = new UserDto
        {
            UserId = user.UserId,
            Email = user.Email,
            Username = user.Username,
            FirstName = user.FirstName,
            LastName = user.LastName,
            BirthDate = user.BirthDate,
            Phone = user.Phone,
            UserRole = (int)user.UserRole,
            Specializare = (int)user.Specializare,
            Description = user.Description,
            ContActiv = user.ContActiv,
            LastLogin = user.LastLogin
        };

        
        return Ok(userDto);
    }

    
    [HttpPatch]
    [Route("users/me")]
    [Authorize]
    public async Task<IActionResult> EditUserForCurrentUser([FromBody] UserDto userDto)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized("User not authorized.");
        }

        int userId = int.Parse(userIdClaim);
        var user = await _db.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        // Update fields if provided
        if (!string.IsNullOrEmpty(userDto.FirstName)) user.FirstName = userDto.FirstName;
        if (!string.IsNullOrEmpty(userDto.LastName)) user.LastName = userDto.LastName;
        if (!string.IsNullOrEmpty(userDto.Phone)) user.Phone = userDto.Phone;
        if (!string.IsNullOrEmpty(userDto.Description)) user.Description = userDto.Description;

        try
        {
            await _db.SaveChangesAsync();
            return Ok(user);  // user should be updated here

        }
        catch (DbUpdateException dbEx)
        {
            return StatusCode(500, $"There was an error editing the user: {dbEx.InnerException?.Message ?? dbEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"There was an error editing the user: {ex.Message}");
        }
    }


    [HttpPatch]
    [Route("users/{id}")]
    [Authorize]
    public async Task<IActionResult> EditUser(int id, [FromBody] UserDto userDto)
    {
        // Log the userDto object to see what's being received

        var user = await _db.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        // Update only the fields that were provided in the request (e.g., contActiv)
        if (userDto.ContActiv != user.ContActiv)
        {
            user.ContActiv = userDto.ContActiv;
        }

        try
        {
            await _db.SaveChangesAsync();
            return Ok(user);
        }
        catch (DbUpdateException dbEx)
        {
            return StatusCode(500, $"There was an error editing the user: {dbEx.InnerException?.Message ?? dbEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"There was an error editing the user: {ex.Message}");
        }
    }


[HttpDelete]
[Route("users/{id}")]
[Authorize]
public async Task<IActionResult> DeleteUser(int id)
{
    var user = await _db.Users.FindAsync(id);
    if (user == null)
    {
        return NotFound();
    }

    try
    {
        _db.Remove(user);
        await _db.SaveChangesAsync();

        return NoContent();
    }
    catch (Exception e)
    {
        return StatusCode(500, "An error has occured while deleting the user. " + e.Message);
    }
}

[HttpPatch]
[Route("users/{id}/reset-password")]
public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordDto resetPasswordDto)
{
    if (string.IsNullOrEmpty(resetPasswordDto.NewPassword))
    {
        return BadRequest("New password cannot be empty.");
    }

    var user = await _db.Users.FindAsync(id);

    if (user == null)
    {
        return NotFound("User not found.");
    }

    // Hash the new password using BCrypt
    user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);

    try
    {
        await _db.SaveChangesAsync();
        return Ok(new { message = "Password reset successfully." });
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"There was an error resetting the password: {ex.Message}");
    }
}

}