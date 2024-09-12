using System.ComponentModel.DataAnnotations.Schema;

namespace Flexident.DTOs;

public class LucrareEfectuataDto
{
    public int LucrareEfectuataId { get; set; }
    public DateTime DataEfectuareLucrare { get; set; }
    public int LucrareLucrareId { get; set; }
    public int PacientPacientId { get; set; }
    
    public int ComentariuId { get; set; }

    public PacientDto Pacient { get; set; }
    public LucrareDto Lucrare { get; set; }
    public ComentariuDto Comentariu { get; set; }
}