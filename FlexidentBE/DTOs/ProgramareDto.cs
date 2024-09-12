namespace Flexident.DTOs;

public class ProgramareDto
{
    public int ProgramareId { get; set; }
    public int PacientPacientId { get; set; }
    public DateTime OraProgramare { get; set; }
    public string DescriereProgramare { get; set; }
    
    public bool ProgramareEfectuata { get; set; }
    public int UserUserId { get; set; }
    public UserDto User { get; set; }

    public PacientDto Pacient { get; set; }

    public int LucrareLucrareId { get; set; }
    public LucrareDto Lucrare { get; set; }
}