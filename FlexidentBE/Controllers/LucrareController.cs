using Flexident.Data;
using Flexident.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Flexident.Controllers;
[Authorize]

public class LucrareController:Controller
{
    private readonly ApplicationDbContext _db;

    public LucrareController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Route("lucrari")]
    public async Task<IActionResult> GetLucrari()
    {

        try
        {
            var lucrari = await _db.Lucrari.ToListAsync();

            var lucrariDto = lucrari.Select(l => new LucrareDto
            {
                LucrareId = l.LucrareId,
                NumeLucrare = l.NumeLucrare,
                PretLucrare = l.PretLucrare,
                DescriereLucrare = l.DescriereLucrare

            });

            return Ok(lucrariDto);
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error getting the list. " + e.Message);
        }
        
    }

    [HttpGet]
    [Route("lucrari/{id}")]
    public async Task<IActionResult> GetLucrare(int id)
    {
        try
        {
            var lucrare = await _db.Lucrari.SingleOrDefaultAsync(l => l.LucrareId == id);

            if (lucrare == null)
            {
                return NotFound();
            }

            var filteredLucrare = new LucrareDto
            {
                LucrareId = lucrare.LucrareId,
                DescriereLucrare = lucrare.DescriereLucrare,
                NumeLucrare = lucrare.NumeLucrare,
                PretLucrare = lucrare.PretLucrare
            };
            return Ok(filteredLucrare);

        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error while retrieving the operation." + e.Message);
        }
    }

    [HttpDelete]
    [Route("lucrari/{id}")]
    public async Task<IActionResult> DeleteLucrare(int id)
    {
            var lucrare = await _db.Lucrari.SingleOrDefaultAsync(l => l.LucrareId == id);
            if (lucrare == null)
            {
                return NotFound();
            }
        try
        {
            _db.Remove(lucrare);
            _db.SaveChangesAsync();
            return Ok("Operation deleted successfully");
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error deleting the user. " + e.Message);
        }
    }
    [HttpPatch]
    [Route("lucrare/{id}")]
    public async Task<IActionResult> PatchLucrare(int id, [FromBody] LucrareDto lucrareDto)
    {
        var lucrare = await _db.Lucrari.FindAsync(id);

        if (lucrare == null)
        {
            return NotFound();
        }

        // Update properties only if they are provided in the request
        if (!string.IsNullOrEmpty(lucrareDto.NumeLucrare) && !string.Equals(lucrare.NumeLucrare, lucrareDto.NumeLucrare, StringComparison.OrdinalIgnoreCase))
        {
            lucrare.NumeLucrare = lucrareDto.NumeLucrare;
        }

        if (lucrareDto.PretLucrare.HasValue && lucrare.PretLucrare != lucrareDto.PretLucrare.Value)
        {
            lucrare.PretLucrare = lucrareDto.PretLucrare.Value;
        }

        if (!string.IsNullOrEmpty(lucrareDto.DescriereLucrare) && !string.Equals(lucrare.DescriereLucrare, lucrareDto.DescriereLucrare, StringComparison.OrdinalIgnoreCase))
        {
            lucrare.DescriereLucrare = lucrareDto.DescriereLucrare;
        }

        try
        {
            await _db.SaveChangesAsync();
            return Ok(lucrare);
        }
        catch (DbUpdateException dbEx)
        {
            return StatusCode(500, $"There was an error editing the lucrare: {dbEx.InnerException?.Message ?? dbEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"There was an error editing the lucrare: {ex.Message}");
        }
    }
}