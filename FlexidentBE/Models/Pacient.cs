using System.ComponentModel.DataAnnotations;

namespace Flexident.Data;

public class Pacient
{
    [Key] public int PacientId { get; set; }
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
}