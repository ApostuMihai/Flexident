using Flexident.Data;


namespace Flexident.DTOs;

public class UserDto
{
    
    public int UserId { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public int UserRole { get; set; }
    public int Specializare { get; set; }
    public string Description { get; set; }
    public bool ContActiv { get; set; }
    public DateTime LastLogin { get; set; }
    
    public string Phone { get; set; }
    public string Password { get; set; }
}