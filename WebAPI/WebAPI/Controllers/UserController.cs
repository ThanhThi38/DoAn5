using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.Services;
using BC = BCrypt.Net.BCrypt;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly doan5Context _context;
        private readonly IFileService _fileService;

        public UserController(doan5Context context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        // GET: api/values
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> Get()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> get(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("ID không tồn tại");
            }
            return user;
        }

        [HttpGet("get-page/{first}/{rows}")]
        public ActionResult<IEnumerable<Users>> GetPage(int first, int rows)
        {
            var res = _context.Users.Skip(first).Take(rows).ToList();
            return Ok(new { list = res, total = _context.Users.Count() });
        }

        [EnableCors("AllowAll")]
        [HttpPost]
        public ActionResult<Users> create(Users user)
        {
            if (!IsValidEmail(user.Email))
            {
                return BadRequest("Email không đúng định dạng");
            }
            var email = _context.Users.Any(e => e.Email == user.Email);
            if (email)
            {
                return BadRequest("Email này đã tồn tại");
            }
            Users u = new Users();
            u.Name = user.Name;
            u.Email = user.Email;
            u.Phone = user.Phone;
            u.Password = BC.HashPassword(user.Password);

            if (user.Image != null)
            {
                u.Image = _fileService.WriteFileBase64(user.Image);
            }

            _context.Add(u);
            _context.SaveChanges();
            return Ok(new { message = "Thêm người dùng thành công." });
        }

        [HttpPut("{id}")]
        public ActionResult update(int id, [FromBody] Users user)
        {
            if (id != user.Id)
            {
                return BadRequest("ID không trùng khớp.");
            }
            var u = _context.Users.Find(id);
            u.Name = user.Name;
            if (!IsValidEmail(user.Email))
            {
                return BadRequest("Email không đúng định dạng.");
            }
            if (u.Email != user.Email)
            {
                var email = _context.Users.Any(e => e.Email == user.Email);
                if (email)
                {
                    return BadRequest("Email này đã tồn tại.");
                }
                u.Email = user.Email;
            }
            u.Phone = user.Phone;
            if (user.Image != null)
            {
                u.Image = _fileService.WriteFileBase64(user.Image);
            }
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return NotFound("Người dùng không tồn tại.");
                }
                else
                {
                    throw;
                }
            }
            return Ok(new { message = "Cập nhật người dùng thành công." });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Users>> delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Người dùng không tồn tại.");
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa người dùng thành công."});
        }

        public bool Exists(int id)
        {
            return _context.Users.Any(c => c.Id == id);
        }

        public bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }


    }
}
