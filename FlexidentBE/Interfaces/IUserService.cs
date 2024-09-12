using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Flexident.Interfaces

{
    public interface IUserService
    {
        Task<IdentityUser> ValidateUser(string username, string password);
        Task<IdentityUser> FindByUsernameAsync(string username);
    }
}


