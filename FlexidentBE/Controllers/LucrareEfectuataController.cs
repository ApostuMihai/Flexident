using Flexident.Data;
using Flexident.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Flexident.Controllers;
[Authorize]

public class LucrareEfectuataController : Controller
{
    private readonly ApplicationDbContext _db;

    public LucrareEfectuataController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Route("lucrari-efectuate")]
    public async Task<IActionResult> GetLucrariEfectuate()
    {
        try
        {
            var lucrariEfectuate = await _db.LucrariEfectuate.Include(le => le.Pacient)
                .Include(le => le.Lucrare)
                .Include(le => le.Comentariu).ToListAsync();

            var lucrariEfectuateDto = lucrariEfectuate.Select(le => new LucrareEfectuataDto
            {
                LucrareEfectuataId = le.LucrareEfectuataId,
                DataEfectuareLucrare = le.DataEfectuareLucrare,
                LucrareLucrareId = le.LucrareLucrareId,
                PacientPacientId = le.PacientPacientId,
                ComentariuId = le.ComentariuComentariuId,
                Pacient = new PacientDto
                {
                    PacientId = le.Pacient.PacientId,
                    Name = le.Pacient.Name,
                    Phone = le.Pacient.Phone,
                    Email = le.Pacient.Email,
                    Age = le.Pacient.Age
                },
                Lucrare = new LucrareDto
                {
                    LucrareId = le.Lucrare.LucrareId,
                    NumeLucrare = le.Lucrare.NumeLucrare,
                    PretLucrare = le.Lucrare.PretLucrare,
                    DescriereLucrare = le.Lucrare.DescriereLucrare
                },
                Comentariu = new ComentariuDto
                {
                    ComentariuId = le.Comentariu.ComentariuId,
                    UserUserId = le.Comentariu.UserUserId,
                    TextComentariu = le.Comentariu.TextComentariu,
                    DataComentariu = le.Comentariu.DataComentariu,
                    User = new UserDto
                    {
                        UserId = le.Comentariu.User.UserId,
                        Email = le.Comentariu.User.Email,
                        Username = le.Comentariu.User.Username,
                        FirstName = le.Comentariu.User.FirstName,
                        LastName = le.Comentariu.User.LastName,
                        UserRole = (int)le.Comentariu.User.UserRole,
                        Phone = le.Comentariu.User.Phone
                    }
                }

            }).ToList();
            return Ok(lucrariEfectuateDto);
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error retrieving the work. " + e.Message);
        }
    }

    [HttpGet]
    [Route("lucrari-efectuate/{id}")]
    public async Task<IActionResult> GetLucrareEfectuata(int id)
    {
        try
        {
            var lucrareEfectuata = await _db.LucrariEfectuate.Include(le => le.Pacient)
                .Include(le => le.Lucrare)
                .Include(le => le.Comentariu).FirstOrDefaultAsync(le => le.LucrareEfectuataId == id);

            if (lucrareEfectuata == null)
            {
                return NotFound();
            }

            var lucrareEfectuataDto = new LucrareEfectuataDto
            {
                LucrareEfectuataId = lucrareEfectuata.LucrareEfectuataId,
                DataEfectuareLucrare = lucrareEfectuata.DataEfectuareLucrare,
                LucrareLucrareId = lucrareEfectuata.LucrareLucrareId,
                PacientPacientId = lucrareEfectuata.PacientPacientId,
                ComentariuId = lucrareEfectuata.ComentariuComentariuId,
                Pacient = new PacientDto
                {
                    PacientId = lucrareEfectuata.Pacient.PacientId,
                    Name = lucrareEfectuata.Pacient.Name,
                    Phone = lucrareEfectuata.Pacient.Phone,
                    Email = lucrareEfectuata.Pacient.Email,
                    Age = lucrareEfectuata.Pacient.Age
                },
                Lucrare = new LucrareDto
                {
                    LucrareId = lucrareEfectuata.Lucrare.LucrareId,
                    NumeLucrare = lucrareEfectuata.Lucrare.NumeLucrare,
                    PretLucrare = lucrareEfectuata.Lucrare.PretLucrare,
                    DescriereLucrare = lucrareEfectuata.Lucrare.DescriereLucrare
                },
                Comentariu = new ComentariuDto
                {
                    ComentariuId = lucrareEfectuata.Comentariu.ComentariuId,
                    UserUserId = lucrareEfectuata.Comentariu.UserUserId,
                    TextComentariu = lucrareEfectuata.Comentariu.TextComentariu,
                    DataComentariu = lucrareEfectuata.Comentariu.DataComentariu,
                    User = new UserDto
                    {
                        UserId = lucrareEfectuata.Comentariu.User.UserId,
                        Email = lucrareEfectuata.Comentariu.User.Email,
                        Username = lucrareEfectuata.Comentariu.User.Username,
                        FirstName = lucrareEfectuata.Comentariu.User.FirstName,
                        LastName = lucrareEfectuata.Comentariu.User.LastName,
                        UserRole = (int)lucrareEfectuata.Comentariu.User.UserRole,
                        Phone = lucrareEfectuata.Comentariu.User.Phone,
                    }
                }

            };
            return Ok(lucrareEfectuata);

        }
        catch (Exception e)
        {
            return StatusCode(500, "An error has occured while getting the work. " + e.Message);
        }
    }

    [HttpPost]
    [Route("lucrari-efectuate")]
    public async Task<IActionResult> AdaugaLucrareEfectuata([FromBody] LucrareEfectuataDto lucrareEfectuataDto)
    {
        try
        {
            if (lucrareEfectuataDto == null)
            {
                return BadRequest();
            }

            var newLucrareEfectuata = new LucrareEfectuata
            {
                DataEfectuareLucrare = lucrareEfectuataDto.DataEfectuareLucrare,
                LucrareLucrareId = lucrareEfectuataDto.LucrareLucrareId,
                PacientPacientId = lucrareEfectuataDto.PacientPacientId,
                ComentariuComentariuId = lucrareEfectuataDto.ComentariuId
            };

            _db.LucrariEfectuate.Add(newLucrareEfectuata);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLucrareEfectuata), new { id = newLucrareEfectuata.LucrareEfectuataId },
                lucrareEfectuataDto);
        }
        catch (Exception e)
        {
            return StatusCode(500, "An error has occured while adding the work. " + e.Message);
        }
    }

    [HttpDelete]
    [Route("lucrari-efectuate/{id}")]
    public async Task<IActionResult> DeleteLucrareEfectuata(int id)
    {
        try
        {
            var lucrareEfectuata = await _db.LucrariEfectuate.FindAsync(id);
            if (lucrareEfectuata == null)
            {
                return NotFound();
            }

            _db.LucrariEfectuate.Remove(lucrareEfectuata);
            _db.SaveChangesAsync();

            return Ok("Work deleted sucessfully.");

        }
        catch (Exception e)
        {
            return StatusCode(500, "An error has occured while deleting the work. " + e.Message);
        }
    }

    [HttpPatch]
    [Route("lucrari-efectuate/{id}")]
public async Task<IActionResult> PatchLucrariEffectuata(int id, [FromBody] LucrareEfectuataDto lucrareEfectuataDto)
{
    try
    {
        if (lucrareEfectuataDto == null)
        {
            return BadRequest();
        }

        var lucrareEfectuata = await _db.LucrariEfectuate.FindAsync(id);
        if (lucrareEfectuata == null)
        {
            return NotFound();
        }

        if (lucrareEfectuataDto.DataEfectuareLucrare != default)
        {
            lucrareEfectuata.DataEfectuareLucrare = lucrareEfectuataDto.DataEfectuareLucrare;
        }

        if (lucrareEfectuataDto.LucrareLucrareId != 0 && lucrareEfectuata.LucrareLucrareId != lucrareEfectuataDto.LucrareLucrareId)
        {
            var lucrare = await _db.Lucrari.FindAsync(lucrareEfectuataDto.LucrareLucrareId);
            if (lucrare == null)
            {
                return NotFound($"Lucrare with ID {lucrareEfectuataDto.LucrareLucrareId} not found.");
            }
            lucrareEfectuata.LucrareLucrareId = lucrareEfectuataDto.LucrareLucrareId;
        }

        if (lucrareEfectuataDto.PacientPacientId != 0 && lucrareEfectuata.PacientPacientId != lucrareEfectuataDto.PacientPacientId)
        {
            var pacient = await _db.Pacienti.FindAsync(lucrareEfectuataDto.PacientPacientId);
            if (pacient == null)
            {
                return NotFound($"Pacient with ID {lucrareEfectuataDto.PacientPacientId} not found.");
            }
            lucrareEfectuata.PacientPacientId = lucrareEfectuataDto.PacientPacientId;
        }

        if (lucrareEfectuataDto.ComentariuId != 0 && lucrareEfectuata.ComentariuComentariuId != lucrareEfectuataDto.ComentariuId)
        {
            var comentariu = await _db.Comentarii.FindAsync(lucrareEfectuataDto.ComentariuId);
            if (comentariu == null)
            {
                return NotFound($"Comentariu with ID {lucrareEfectuataDto.ComentariuId} not found.");
            }
            lucrareEfectuata.ComentariuComentariuId = lucrareEfectuataDto.ComentariuId;
        }

        _db.LucrariEfectuate.Update(lucrareEfectuata);
        await _db.SaveChangesAsync();

        return Ok("LucrariEffectuate updated successfully.");
    }
    catch (Exception e)
    {
        return StatusCode(500, "There was an error updating the LucrariEffectuate: " + e.Message);
    }
}

}
