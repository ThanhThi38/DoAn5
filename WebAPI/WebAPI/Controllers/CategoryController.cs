using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly doan5Context _context;

        public CategoryController(doan5Context context)
        {
            _context = context;
        }

        // GET: api/values
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categories>>> Get()
        {
            return await _context.Categories.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Categories>> get(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Không tồn tại id này.");
            }
            return category;
        }

        [HttpGet("get-page/{first}/{rows}")]
        public ActionResult<IEnumerable<Categories>> GetPage(int first, int rows)
        {
            var res = _context.Categories.Skip(first).Take(rows).ToList();
            return Ok(new { list = res, total = _context.Categories.Count() });
        }


        [HttpPost]
        public ActionResult<Categories> create(Categories category)
        {
            var c = new Categories();
            c.Name = category.Name;
            c.Slug = category.Slug;
            c.SortOrder = category.SortOrder;
            c.Status = true;
            _context.Categories.Add(c);
            _context.SaveChanges();
            return Ok(new { message = "Thêm danh mục thành công."});
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> update(int id, [FromBody] Categories category)
        {
            if (id != category.Id)
            {
                return BadRequest("ID không trùng khớp.");
            }
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return NotFound("Danh mục không tồn tại.");
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Cập nhật danh mục thành công." });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Categories>> delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Danh mục không tồn tại.");
            }
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa danh mục thành công." });
        }

        public bool Exists(int id)
        {
            return _context.Categories.Any(c => c.Id == id);
        }

        [HttpPost("hide")]
        public ActionResult hide(Categories category)
        {
            var c = _context.Categories.Find(category.Id);
            if (c == null)
            {
                return NotFound("Danh mục không tồn tại.");
            }
            c.Status = false;
            _context.SaveChanges();
            return Ok(new { message = "Ẩn danh mục thành công" });
        }

        [HttpPost("show")]
        public ActionResult show(Categories category)
        {
            var c = _context.Categories.Find(category.Id);
            if (c == null)
            {
                return NotFound("Danh mục không tồn tại.");
            }
            c.Status = true;
            _context.SaveChanges();
            return Ok(new { message = "Hiện danh mục thành công" });
        }
    }
}
