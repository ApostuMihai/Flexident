using Flexident.Data;
using Flexident.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Flexident.Controllers;
[Authorize]

public class ProgramareController : Controller
{
    private readonly ApplicationDbContext _db;

    public ProgramareController(ApplicationDbContext db)
    {
        _db = db;
    }
    
    [HttpGet]
    [Route("programari")]
public async Task<IActionResult> GetProgramari([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] DateTime? date = null)
{
    try
    {
        var query = _db.Programari
            .Include(p => p.User)
            .Include(p => p.Pacient)
            .Include(p => p.Lucrare)
            .AsQueryable();

        // If date is provided, filter by date
        if (date.HasValue)
        {
            // Convert the date to the same timezone as OraProgramare (assuming it's in UTC here)
            var startDate = date.Value.Date.ToUniversalTime();
            var endDate = startDate.AddDays(1);
            
            query = query.Where(p => p.OraProgramare >= startDate && p.OraProgramare < endDate);
        }

        var totalRecords = await query.CountAsync();

        var programari = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var programariDto = programari.Select(p => new ProgramareDto
        {
            ProgramareId = p.ProgramareId,
            PacientPacientId = p.PacientPacientId,
            OraProgramare = p.OraProgramare,
            DescriereProgramare = p.DescriereProgramare,
            ProgramareEfectuata = p.ProgramareEfectuata,
            UserUserId = p.UserUserId,
            User = new UserDto
            {
                UserId = p.User.UserId,
                Email = p.User.Email,
                Username = p.User.Username,
                FirstName = p.User.FirstName,
                LastName = p.User.LastName,
                BirthDate = p.User.BirthDate,
                Phone = p.User.Phone,
                UserRole = (int)p.User.UserRole,
                Specializare = (int)p.User.Specializare,
                Description = p.User.Description,
                ContActiv = p.User.ContActiv,
                LastLogin = p.User.LastLogin
            },
            Pacient = new PacientDto
            {
                PacientId = p.Pacient.PacientId,
                Name = p.Pacient.Name,
                Phone = p.Pacient.Phone,
                Email = p.Pacient.Email,
                Age = p.Pacient.Age
            },
            Lucrare = new LucrareDto
            {
                LucrareId = p.Lucrare.LucrareId,
                NumeLucrare = p.Lucrare.NumeLucrare,
                DescriereLucrare = p.Lucrare.DescriereLucrare,
                PretLucrare = p.Lucrare.PretLucrare
            }
        }).ToList();

        var result = new
        {
            TotalRecords = totalRecords,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Programari = programariDto
        };

        return Ok(result);
    }
    catch (Exception e)
    {
        return StatusCode(500, "An error has occurred while retrieving the appointments. " + e.Message);
    }
}


    
    [HttpGet]
    [Route("programari/{id}")]
    public async Task<IActionResult> GetProgramare(int id)
    {
        try
        {
            var programare = await _db.Programari
                .Include(p => p.User)
                .Include(p => p.Pacient)
                .Include (p=>p.Lucrare)
                .FirstOrDefaultAsync(p => p.ProgramareId == id);

            if (programare == null)
            {
                return NotFound();
            }

            var programareDto = new ProgramareDto
            {
                ProgramareId = programare.ProgramareId,
                PacientPacientId = programare.PacientPacientId,
                OraProgramare = programare.OraProgramare,
                DescriereProgramare = programare.DescriereProgramare,
                ProgramareEfectuata = programare.ProgramareEfectuata,

                UserUserId = programare.UserUserId,
                User = new UserDto
                {
                    UserId = programare.User.UserId,
                    Email = programare.User.Email,
                    Username = programare.User.Username,
                    FirstName = programare.User.FirstName,
                    LastName = programare.User.LastName,
                    BirthDate = programare.User.BirthDate,
                    Phone = programare.User.Phone,
                    UserRole = (int)programare.User.UserRole,
                    Specializare = (int)programare.User.Specializare,
                    Description = programare.User.Description,
                    ContActiv = programare.User.ContActiv,
                    LastLogin = programare.User.LastLogin
                },
                Pacient = new PacientDto
                {
                    PacientId = programare.Pacient.PacientId,
                    Name = programare.Pacient.Name,
                    Phone = programare.Pacient.Phone,
                    Email = programare.Pacient.Email,
                    Age = programare.Pacient.Age
                },
                Lucrare = new LucrareDto
                {
                    LucrareId = programare.Lucrare.LucrareId,
                    NumeLucrare = programare.Lucrare.NumeLucrare,
                    DescriereLucrare = programare.Lucrare.DescriereLucrare,
                    PretLucrare = programare.Lucrare.PretLucrare
                }
            };

            return Ok(programareDto);
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error retrieving the appointment. " + e.Message);
        }
    }
    
    [HttpGet]
[Route("pacienti/{pacientId}/programari")]
public async Task<IActionResult> GetProgramariByPacientId(int pacientId)
{
    try
    {
        var programari = await _db.Programari
            .Include(p => p.User)
            .Include(p => p.Pacient)
            .Include(p => p.Lucrare)
            .Where(p => p.PacientPacientId == pacientId)
            .ToListAsync();

        if (!programari.Any())
        {
            return NotFound($"No appointments found for pacient with ID {pacientId}.");
        }

        var programariDto = programari.Select(p => new ProgramareDto
        {
            ProgramareId = p.ProgramareId,
            PacientPacientId = p.PacientPacientId,
            OraProgramare = p.OraProgramare,
            DescriereProgramare = p.DescriereProgramare,
            ProgramareEfectuata = p.ProgramareEfectuata,
            UserUserId = p.UserUserId,
            User = new UserDto
            {
                UserId = p.User.UserId,
                Email = p.User.Email,
                Username = p.User.Username,
                FirstName = p.User.FirstName,
                LastName = p.User.LastName,
                BirthDate = p.User.BirthDate,
                Phone = p.User.Phone,
                UserRole = (int)p.User.UserRole,
                Specializare = (int)p.User.Specializare,
                Description = p.User.Description,
                ContActiv = p.User.ContActiv,
                LastLogin = p.User.LastLogin
            },
            Pacient = new PacientDto
            {
                PacientId = p.Pacient.PacientId,
                Name = p.Pacient.Name,
                Phone = p.Pacient.Phone,
                Email = p.Pacient.Email,
                Age = p.Pacient.Age
            },
            Lucrare = new LucrareDto
            {
                LucrareId = p.Lucrare.LucrareId,
                NumeLucrare = p.Lucrare.NumeLucrare,
                DescriereLucrare = p.Lucrare.DescriereLucrare,
                PretLucrare = p.Lucrare.PretLucrare
            }
        }).ToList();

        return Ok(programariDto);
    }
    catch (Exception e)
    {
        return StatusCode(500, $"An error occurred while retrieving the appointments for pacientId {pacientId}: {e.Message}");
    }
}

    
    [HttpPost]
    [Route("programari")]
    public async Task<IActionResult> CreateProgramare([FromBody] ProgramareDto programareDto)
    {
        try
        {
            if (programareDto == null)
            {
                return BadRequest();
            }

            var newProgramare = new Programare
            {
                PacientPacientId = programareDto.PacientPacientId,
                OraProgramare = programareDto.OraProgramare,
                DescriereProgramare = programareDto.DescriereProgramare,
                UserUserId = programareDto.UserUserId,
                LucrareLucrareId = programareDto.LucrareLucrareId
            };

            _db.Programari.Add(newProgramare);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProgramare), new { id = newProgramare.ProgramareId }, programareDto);
        }
        catch (Exception e)
        {
            return StatusCode(500, "An error has occurred while adding the appointment. " + e.Message);
        }
    }

    
    [HttpPatch]
    [Route("programari/{id}")]
    public async Task<IActionResult> UpdateProgramare(int id, [FromBody] ProgramareDto programareDto)
    {
        try
        {
            if (programareDto == null)
            {
                return BadRequest("The provided data is invalid.");
            }

            var programare = await _db.Programari.FindAsync(id);
            if (programare == null)
            {
                return NotFound($"No appointment found with ID {id}.");
            }

            // Update the properties only if they are provided in the DTO
            programare.PacientPacientId = programareDto.PacientPacientId != 0 
                ? programareDto.PacientPacientId 
                : programare.PacientPacientId;

            programare.OraProgramare = programareDto.OraProgramare != default 
                ? DateTime.SpecifyKind(programareDto.OraProgramare, DateTimeKind.Utc) 
                : programare.OraProgramare;

            programare.DescriereProgramare = programareDto.DescriereProgramare ?? programare.DescriereProgramare;

            programare.UserUserId = programareDto.UserUserId != 0 
                ? programareDto.UserUserId 
                : programare.UserUserId;

            if (programareDto.LucrareLucrareId != 0)
            {
                programare.LucrareLucrareId = programareDto.LucrareLucrareId;
            }

            // Update programareEfectuata if provided
            if (programareDto.ProgramareEfectuata != programare.ProgramareEfectuata)
            {
                programare.ProgramareEfectuata = programareDto.ProgramareEfectuata;
            }

            // Save changes to the database
            _db.Programari.Update(programare);
            await _db.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, $"An error occurred while updating the appointment: {e.Message}");
        }
    }

    
    [HttpDelete]
    [Route("programari/{id}")]
    public async Task<IActionResult> DeleteProgramare(int id)
    {
        try
        {
            var programare = await _db.Programari.FindAsync(id);
            if (programare == null)
            {
                return NotFound();
            }

            _db.Programari.Remove(programare);
            await _db.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, "An error has occured while deleting the appointment. " + e.Message);
        }
    }
}