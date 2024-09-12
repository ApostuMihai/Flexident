using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flexident.Data;

public class Programare
{
    [Key] public int ProgramareId { get; set; }
    [ForeignKey("Pacient")] public int PacientPacientId { get; set; }
    public virtual Pacient Pacient { get; set; }
    public DateTime OraProgramare { get; set; }
    public string DescriereProgramare { get; set; }

    public bool ProgramareEfectuata { get; set; }
    [ForeignKey("User")] public int UserUserId { get; set; }
    public virtual User User { get; set; }
    
    [ForeignKey("Lucrare")] public int LucrareLucrareId { get; set; }
    public virtual Lucrare Lucrare { get; set; }
}