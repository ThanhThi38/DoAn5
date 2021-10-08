using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Models;
using BC = BCrypt.Net.BCrypt;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly doan5Context _context;

        public AdminController(doan5Context context)
        {
            _context = context;
        }

        [HttpPost, Route("login")]
        public IActionResult Login([FromBody] Users user)
        {
            if (user == null)
                return BadRequest("Dữ liệu nhập vào không hợp lệ!");
            if ((user = UserExists(user.Email, user.Password)) != null)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                var tokeOptions = new JwtSecurityToken(
                    //issuer: "http://localhost:5001",
                    //audience: "http://localhost:5001",
                    claims: new List<Claim>(),
                    expires: DateTime.Now.AddDays(7),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString, user });
            } else
            {
                return Unauthorized("Email hoặc mật khẩu không hợp lệ.");
            }
        }

        public Users UserExists(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return null;
            var user = _context.Users.SingleOrDefault(e => e.Email == email);
            if (user == null)
                return null;

            if (!BC.Verify(password, user.Password))
            {
                return null;
            }
            return user;
        }
    }
}
