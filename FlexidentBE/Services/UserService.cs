using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Flexident.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Flexident.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<IdentityUser> _userManager;

        public UserService(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }
        public async Task<IdentityUser> FindByUsernameAsync(string username)
        {
            return await _userManager.Users.SingleOrDefaultAsync(u => u.UserName == username);
        }

        public async Task<IdentityUser> ValidateUser(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user != null && await _userManager.CheckPasswordAsync(user, password))
            {
                return user;
            }
            return null;
        }
    }
}