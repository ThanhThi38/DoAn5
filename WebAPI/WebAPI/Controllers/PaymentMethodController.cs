using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentMethodController: ControllerBase
    {
        private readonly doan5Context _context;
        private readonly IFileService _fileService;

        public PaymentMethodController(
            doan5Context context,
            IFileService fileService
        )
        {
            _context = context;
            _fileService = fileService;
        }

        // GET: api/values
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentMethods>>> Get()
        {
            return await _context.PaymentMethods.ToListAsync();
        }

        [HttpGet("get-page/{first}/{rows}")]
        public ActionResult<IEnumerable<PaymentMethods>> GetPage(int first, int rows)
        {
            var res = _context.PaymentMethods.Skip(first).Take(rows).ToList();
            return Ok(new { list = res, total = _context.PaymentMethods.Count() });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentMethods>> get(int id)
        {
            var payment_method = await _context.PaymentMethods.FindAsync(id);
            if (payment_method == null)
            {
                return NotFound("Không tồn tại id này.");
            }
            return payment_method;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PaymentMethods>> create(PaymentMethods payment_method)
        {
            PaymentMethods pm = new PaymentMethods();
            pm.Name = payment_method.Name;
            pm.Description = payment_method.Description;

            if(payment_method.Image != null)
            {
                pm.Image = _fileService.WriteFileBase64(payment_method.Image);
            }

            _context.Add(pm);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm thanh toán thành công." });
        }

        [Authorize]
        [HttpPut("{id}")]
        public ActionResult update(int id, [FromBody] PaymentMethods payment_method)
        {
            if (id != payment_method.Id)
            {
                return BadRequest("ID không trùng khớp.");
            }
            var pm = _context.PaymentMethods.Find(id);
            pm.Name = payment_method.Name;
            pm.Description = payment_method.Description;
            if (payment_method.Image != null)
            {
                pm.Image = _fileService.WriteFileBase64(payment_method.Image);
            }
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return NotFound("Thanh toán không tồn tại.");
                }
                else
                {
                    throw;
                }
            }
            return Ok(new { message = "Cập nhật thanh toán thành công." });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<PaymentMethods>> delete(int id)
        {
            var payment_method = await _context.PaymentMethods.FindAsync(id);
            if (payment_method == null)
            {
                return NotFound("Thanh toán không tồn tại.");
            }
            _context.PaymentMethods.Remove(payment_method);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thanh toán thành công." });
        }

        public bool Exists(int id)
        {
            return _context.PaymentMethods.Any(c => c.Id == id);
        }
    }
}
