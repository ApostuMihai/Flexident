using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flexident.Data;

public class LucrareEfectuata
{
    [Key] public int LucrareEfectuataId { get; set; }

    public DateTime DataEfectuareLucrare { get; set; }

    [ForeignKey("Lucrare")] public int LucrareLucrareId { get; set; }
    public virtual Lucrare Lucrare { get; set; }

    [ForeignKey("Pacient")] public int PacientPacientId { get; set; }
    public virtual Pacient Pacient { get; set; }

    [ForeignKey("Comentariu")] public int ComentariuComentariuId { get; set; }
    public virtual Comentariu Comentariu { get; set; }

}