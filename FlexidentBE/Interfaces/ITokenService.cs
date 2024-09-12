using Flexident.Data;
using Microsoft.AspNetCore.Identity;

namespace Flexident.Interfaces;


    public interface ITokenService
    {
        Task<string> ValidateUser(string username, string password);  // Validate the user and return the token
        string GenerateToken(User user); 
    }
