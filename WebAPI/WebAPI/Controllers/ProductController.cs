using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using WebAPI.Models;
using WebAPI.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly doan5Context _context;
        private readonly IFileService _fileService;

        public ProductController(doan5Context context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        // GET: api/values
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Products>>> Get()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpGet("get-page/{first}/{rows}")]
        public ActionResult<IEnumerable<Products>> GetPage(int first, int rows)
        {
            var res = _context.Products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.Sale,
                p.Status,
                Images = _context.Images.Where(i => i.ProductId == p.Id).ToList(),
                totalQty = _context.Options.Where(o => o.ProductId == p.Id).Sum(e => e.Quantity)
            }).Skip(first).Take(rows).ToList();
            return Ok(new { list = res, total = _context.Products.Count() });
        }

        [HttpGet("{id}")]
        public ActionResult get(int id)
        {
            var product = _context.Products
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.CategoryId,
                    p.Slug,
                    p.Sale,
                    p.Price,
                    p.Description,
                    p.Content,
                    p.Status,
                    Options = _context.Options.Where(o => o.ProductId == id).ToList(),
                    Images = _context.Images.Where(i => i.ProductId == id).ToList(),
                    Categories = _context.Categories.First(c => c.Id == p.CategoryId)
        })
                .FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }


        [HttpPost]
        public ActionResult create([FromBody] Products data)
        {
            var product = new Products();
            product.Name = data.Name;
            product.Slug = data.Slug;
            product.Price = data.Price;
            product.Sale = data.Sale;
            product.Description = data.Description;
            product.Content = data.Content;
            product.Status = true;
            product.CategoryId = data.CategoryId;
            _context.Products.Add(product);
            _context.SaveChanges();

            if (data.Images != null)
            {
                foreach (var item in data.Images)
                {
                    var image = new Images();
                    image.ProductId = product.Id;
                    image.Name = _fileService.WriteFileBase64(item.Name);
                    _context.Images.Add(image);
                    _context.SaveChanges();
                }
            }

            if (data.Options != null)
            {
                foreach (var item in data.Options)
                {
                    var option = new Options();
                    option.ProductId = product.Id;
                    option.Name = item.Name;
                    option.Quantity = item.Quantity;
                    option.Price = item.Price;
                    _context.Options.Add(option);
                    _context.SaveChanges();
                }
            }
            return Ok(new { message = "Thêm sản phẩm thành công." });
        }

        [HttpPut("{id}")]
        public ActionResult update(int id, [FromBody] Products data)
        {
            if (id != data.Id)
            {
                return BadRequest("ID không trùng khớp.");
            }
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return BadRequest("Sản phẩm không tồn tại.");
            }
            product.Name = data.Name;
            product.Slug = data.Slug;
            product.Price = data.Price;
            product.Sale = data.Sale;
            product.Description = data.Description;
            product.Content = data.Content;
            product.CategoryId = data.CategoryId;
            _context.SaveChanges();

            if (data.Images.Count() != 0)
            {
                var img = _context.Images.Where(i => i.ProductId == id);
                _context.Images.RemoveRange(img);

                foreach (var item in data.Images)
                {
                    var image = new Images();
                    image.ProductId = product.Id;
                    image.Name = _fileService.WriteFileBase64(item.Name);
                    _context.Images.Add(image);
                    _context.SaveChanges();
                }
            }

            if (data.Options.Count() != 0)
            {
                var op = _context.Options.Where(o => o.ProductId == id);
                _context.Options.RemoveRange(op);

                foreach (var item in data.Options)
                {
                    var option = new Options();
                    option.ProductId = id;
                    option.Name = item.Name;
                    option.Quantity = item.Quantity;
                    option.Price = item.Price;
                    _context.Options.Add(option);
                    _context.SaveChanges();
                }
            }
            return Ok(new { message = "Cập nhật sản phẩm thành công." });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Products>> delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        public bool Exists(int id)
        {
            return _context.Products.Any(c => c.Id == id);
        }

        [HttpPost("hide")]
        public ActionResult hide(Products product)
        {
            var c = _context.Products.Find(product.Id);
            if (c == null)
            {
                return NotFound("Sản phẩm không tồn tại.");
            }
            c.Status = false;
            _context.SaveChanges();
            return Ok(new { message = "Ẩn Sản phẩm thành công" });
        }

        [HttpPost("show")]
        public ActionResult show(Products product)
        {
            var c = _context.Products.Find(product.Id);
            if (c == null)
            {
                return NotFound("Sản phẩm không tồn tại.");
            }
            c.Status = true;
            _context.SaveChanges();
            return Ok(new { message = "Hiện Sản phẩm thành công" });
        }
    }
}
