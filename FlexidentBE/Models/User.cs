using System.ComponentModel.DataAnnotations;

namespace Flexident.Data;

    public enum UserRole
    {
        Doctor = 1,
        Asistent = 2,
        Admin = 3
    }

    public enum Specializare
    {
        Asistent = 1,
        Generalist = 2,
        Endodont = 3,
        Ortodont = 4,
        Chirurg =5,
        Pedodont = 6,
        Parodontolog =7,
        Protetician = 8,
        Implantolog =9,
        None = 10,
        
    }
public class User
{
    [Key] public int UserId { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    public string Phone { get; set; }
    public DateTime BirthDate { get; set; }
    public UserRole UserRole { get; set; }
    public Specializare Specializare { get; set; }
    public string Description { get; set; }
    public bool ContActiv { get; set; }
    public DateTime LastLogin { get; set; }
}