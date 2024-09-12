using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flexident.Data;

public class Comentariu
{
    [Key] public int ComentariuId { get; set; }

    [ForeignKey("User")] public int UserUserId { get; set; }
    public virtual User User { get; set; }
    
    public string TextComentariu { get; set; }
    public DateTime DataComentariu { get; set; }
    
}