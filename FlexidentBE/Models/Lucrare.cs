using System.ComponentModel.DataAnnotations;

namespace Flexident.Data;

public class Lucrare
{
    [Key] public int LucrareId { get; set; }
    public string NumeLucrare { get; set; }
    public int PretLucrare { get; set; }
    public string DescriereLucrare { get; set; }
}