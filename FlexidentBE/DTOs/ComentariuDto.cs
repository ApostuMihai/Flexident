namespace Flexident.DTOs;

public class ComentariuDto
{
    public int ComentariuId { get; set; }
    public int UserUserId { get; set; }
    public string TextComentariu { get; set; }
    public DateTime DataComentariu { get; set; }

    public UserDto User { get; set; }

}