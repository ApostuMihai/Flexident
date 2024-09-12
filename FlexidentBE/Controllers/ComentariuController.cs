using Flexident.Data;
using Flexident.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Flexident.Controllers;
[Authorize]

public class ComentariuController : Controller
{
    private readonly ApplicationDbContext _db;

    public ComentariuController(ApplicationDbContext db)
    {
        _db = db;
    }


    [HttpGet]
    [Route("comentarii")]
    public async Task<IActionResult> GetComentarii()
    {

        try
        {
            var comentarii = await _db.Comentarii.Include(c => c.User).ToListAsync();

            var comentariiDto = comentarii.Select(c => new ComentariuDto
            {
                ComentariuId = c.ComentariuId,
                UserUserId = c.UserUserId,
                TextComentariu = c.TextComentariu,
                DataComentariu = c.DataComentariu,
                User = new UserDto
                    {
                        UserId = c.User.UserId,
                        Email = c.User.Email,
                        Username = c.User.Username,
                        FirstName = c.User.FirstName,
                        LastName = c.User.LastName,
                        UserRole = (int)c.User.UserRole,
                        Phone = c.User.Phone
                    }
                    
            }).ToList();

            return Ok(comentariiDto);
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error retrieving the comments. " + e.Message);
        }

    }

    [HttpGet]
    [Route("comentarii/{id}")]
    public async Task<IActionResult> GetComentariu(int id)
    {

        try
        {
            var comentariu = await _db.Comentarii.Include(c => c.User).FirstOrDefaultAsync(c => c.ComentariuId == id);

            if (comentariu == null)
            {
                return NotFound();
            }

            var filteredComentariu = new ComentariuDto
            {
                ComentariuId = comentariu.ComentariuId,
                UserUserId = comentariu.UserUserId,
                TextComentariu = comentariu.TextComentariu,
                DataComentariu = comentariu.DataComentariu,
                User = new UserDto
                    {
                        UserId = comentariu.User.UserId,
                        Email = comentariu.User.Email,
                        Username = comentariu.User.Username,
                        FirstName = comentariu.User.FirstName,
                        LastName = comentariu.User.LastName,
                        UserRole = (int)comentariu.User.UserRole,
                        Specializare = (int)comentariu.User.Specializare
                    }
                    
            };

            return Ok(filteredComentariu);
        }
        catch (Exception e)
        {
            return StatusCode(500, "An error has occured while retrieving the comment. " + e.Message);
        }

    }

    [HttpPost]
    [Route("/comentarii")]
    public async Task<IActionResult> PostComentariu([FromBody] ComentariuDto comentariuDto)
    {
        if (comentariuDto == null)
        {
            return BadRequest();
        }

        var user = await _db.Users.FindAsync(comentariuDto.UserUserId);
        if (user == null)
        {
            return NotFound($"User with ID {comentariuDto.UserUserId} not found.");
        }

        var newComentariu = new Comentariu
        {
            UserUserId = comentariuDto.UserUserId,
            TextComentariu = comentariuDto.TextComentariu,
            DataComentariu = comentariuDto.DataComentariu
        };

        _db.Comentarii.Add(newComentariu);

        try
        {
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetComentariu), new { id = newComentariu.ComentariuId }, newComentariu);
        }
        catch (DbUpdateException dbEx)
        {
            return StatusCode(500, $"There was an error creating the comentariu: {dbEx.InnerException?.Message ?? dbEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"There was an error creating the comentariu: {ex.Message}");
        }
    }

    [HttpDelete]
    [Route("comentarii/{id}")]
    public async Task<IActionResult> DeleteComentariu(int id)
    {
        var comentariu = await _db.Comentarii.FindAsync(id);
        if (comentariu == null)
        {
            return NotFound();
        }

        try
        {
            _db.Remove(comentariu);
            await _db.SaveChangesAsync();
            return Ok("The comment has been successfully deleted.");
        }
        catch (Exception e)
        {
            return StatusCode(500, "There was an error deleting the comment. " + e.Message);
        }
    }
    [HttpPatch]
    [Route("comentarii/{id}")]
    public async Task<IActionResult> UpdateComentariu(int id, [FromBody] ComentariuDto comentariuDto)
    {
        try
        {
            if (comentariuDto == null)
            {
                return BadRequest();
            }

            var comentariu = await _db.Comentarii.Include(c => c.User).FirstOrDefaultAsync(c => c.ComentariuId == id);
            if (comentariu == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(comentariuDto.TextComentariu))
            {
                comentariu.TextComentariu = comentariuDto.TextComentariu;
            }

            if (comentariuDto.DataComentariu != default)
            {
                comentariu.DataComentariu = comentariuDto.DataComentariu;
            }

            if (comentariuDto.UserUserId != 0 && comentariu.UserUserId != comentariuDto.UserUserId)
            {
                var user = await _db.Users.FindAsync(comentariuDto.UserUserId);
                if (user == null)
                {
                    return NotFound($"User with ID {comentariuDto.UserUserId} not found.");
                }

                comentariu.UserUserId = comentariuDto.UserUserId;
            }

            _db.Comentarii.Update(comentariu);
            await _db.SaveChangesAsync();

            return Ok("Comment updated successfully. ");
        }
        catch (Exception e)
        {
            return StatusCode(500, "An error has occured while updating the comment. " + e.Message);
        }
    }
}
