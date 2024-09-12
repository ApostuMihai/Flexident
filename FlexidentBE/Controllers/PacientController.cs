using Flexident.Data;
using Flexident.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Flexident.Controllers;
[Authorize]

public class PacientController : Controller
{
    private readonly ApplicationDbContext _db;

    public PacientController(ApplicationDbContext db)
    {
        _db = db;
    }


    [HttpGet]
    [Route("/pacienti")]
    public async Task<IActionResult> GetPacienti(int page = 1, int pageSize = 10)
    {
        try
        {
            // Calculate the total number of patients
            var totalPatients = await _db.Pacienti.CountAsync();

            // Retrieve the paginated and sorted list of patients
            var pacienti = await _db.Pacienti
                .OrderByDescending(p => p.PacientId) // Ensure the patients are sorted by PacientId
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Map to DTO
            var pacientiDto = pacienti.Select(pacient => new PacientDto
            {
                PacientId = pacient.PacientId,
                Name = pacient.Name,
                Phone = pacient.Phone,
                Email = pacient.Email,
                Age = pacient.Age
            }).ToList();

            // Return paginated response with total count
            return Ok(new 
            { 
                Data = pacientiDto, 
                TotalCount = totalPatients 
            });
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error retrieving the pacients. " + e.Message);
        }
    }


    [HttpGet]
    [Route("pacienti/{id}")]
    public async Task<IActionResult> GetPacient(int id)
    {
        try
        {
            var pacient = await _db.Pacienti.SingleOrDefaultAsync(p => p.PacientId == id);
            if (pacient == null)
            {
                return NotFound();
            }

            var filteredPacient = new PacientDto
            {
                PacientId = pacient.PacientId,
                Name = pacient.Name,
                Phone = pacient.Phone,
                Email = pacient.Email,
                Age = pacient.Age
            };
            return Ok(filteredPacient);

        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error retrieving the pacient." + e.Message);
        }
    }

    [HttpPost]
    [Route("pacienti")]
    public async Task<IActionResult> PostPacient([FromBody] Pacient pacient)
    {

        try
        {
            var newPacient = new Pacient
            {
                Age = pacient.Age,
                Email = pacient.Email,
                Name = pacient.Name,
                Phone = pacient.Phone
            };

            _db.Add(newPacient);
            await _db.SaveChangesAsync();

            return Ok(newPacient);
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error adding the pacient. " + e.Message);
        }
       
    }

    [HttpDelete]
    [Route("/pacienti/{id}")]
    public async Task<IActionResult> DeletePacient(int id)
    {
        var pacient = await _db.Pacienti.FindAsync(id);
        if (pacient == null)
        {
            return NotFound();
        }

        try
        {
            _db.Remove(pacient);
            await _db.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error deleting the pacient. " + e.Message);
        }
    }
    
    [HttpPatch]
    [Route("pacienti/{id}")]
    public async Task<IActionResult> PatchPacient(int id, [FromBody] PacientDto pacientDto)
    {
        var pacient = await _db.Pacienti.FindAsync(id);

        if (pacient == null)
        {
            return NotFound();
        }

        // Update properties only if they are provided in the request
        if (!string.IsNullOrEmpty(pacientDto.Name) && !string.Equals(pacient.Name, pacientDto.Name, StringComparison.OrdinalIgnoreCase))
        {
            pacient.Name = pacientDto.Name;
        }

        if (!string.IsNullOrEmpty(pacientDto.Phone) && !string.Equals(pacient.Phone, pacientDto.Phone, StringComparison.OrdinalIgnoreCase))
        {
            pacient.Phone = pacientDto.Phone;
        }

        if (!string.IsNullOrEmpty(pacientDto.Email) && !string.Equals(pacient.Email, pacientDto.Email, StringComparison.OrdinalIgnoreCase))
        {
            pacient.Email = pacientDto.Email;
        }

        if (pacientDto.Age.HasValue && pacient.Age != pacientDto.Age.Value)
        {
            pacient.Age = pacientDto.Age.Value;
        }

        try
        {
            await _db.SaveChangesAsync();
            return Ok(pacient);
        }
        catch (DbUpdateException dbEx)
        {
            return StatusCode(500, $"There was an error editing the pacient: {dbEx.InnerException?.Message ?? dbEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"There was an error editing the pacient: {ex.Message}");
        }
    }
}