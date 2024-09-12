using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Flexident.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Pacient> Pacienti { get; set; }
    public DbSet<Programare> Programari { get; set; }
    public DbSet<Lucrare> Lucrari { get; set; }
    public DbSet<LucrareEfectuata> LucrariEfectuate { get; set; }
    public DbSet<Comentariu> Comentarii { get; set; }
    
   
}