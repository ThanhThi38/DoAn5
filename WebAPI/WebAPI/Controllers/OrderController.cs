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
    public class OrderController : ControllerBase
    {
        private readonly doan5Context _context;

        public OrderController(doan5Context context)
        {
            _context = context;
        }

        // GET: api/values
        [HttpGet]
        public ActionResult<IEnumerable<Orders>> Get()
        {
            var res = _context.Orders.Select(o => new
            {
                o.Id,
                o.CustomerId,
                o.CreatedAt,
                o.PaymentId,
                o.AddressId,
                o.Status,
                Shipping = _context.ShippingAddress.First(s => s.Id == o.AddressId),
                Customers = _context.Customers.First(c => c.Id == o.CustomerId),
                DetailOrders = _context.DetailOrders.Where(t => t.OrderId == o.Id).ToList(),
                PaymentMethods = _context.PaymentMethods.First(p => p.Id == o.PaymentId)
            }).ToList();
            return Ok(res);
        }

        [HttpGet("get-page/{first}/{rows}")]
        public ActionResult<IEnumerable<Orders>> GetPage(int first, int rows)
        {
            var res = _context.Orders.Select(o => new
            {
                o.Id,
                o.CustomerId,
                o.CreatedAt,
                o.PaymentId,
                o.AddressId,
                o.Status,
                Shipping = _context.ShippingAddress.First(s => s.Id == o.AddressId),
                Customers = _context.Customers.First(c => c.Id == o.CustomerId),
                detailOrders = _context.DetailOrders.Where(t => t.OrderId == o.Id).ToList(),
                PaymentMethods = _context.PaymentMethods.First(p => p.Id == o.PaymentId)
            }).Skip(first).Take(rows).ToList();
            return Ok(new { list = res, total = _context.Orders.Count() });
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var res = _context.Orders.Select(o => new
            {
                o.Id,
                o.CustomerId,
                o.CreatedAt,
                o.PaymentId,
                o.AddressId,
                o.Status,
                Shipping = _context.ShippingAddress.First(s => s.Id == o.AddressId),
                Customers = _context.Customers.First(c => c.Id == o.CustomerId),
                detailOrders = _context.DetailOrders.Where(t => t.OrderId == o.Id).ToList(),
                PaymentMethods = _context.PaymentMethods.First(p => p.Id == o.PaymentId)
            }).First(x => x.Id == id);
            return Ok(res);
        }

        [HttpPut, Route("{id}")]
        public IActionResult Update(int id, Orders order)
        {
            var od = _context.Orders.Find(id);
            if (od == null)
            {
                return NotFound();
            }
            od.Status = order.Status;
            _context.SaveChanges();
            return Ok(order.Status);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }
            _context.Orders.Remove(order);
            _context.SaveChanges();
            return Ok(order);
        }

        public bool Exists(int id)
        {
            return _context.Orders.Any(c => c.Id == id);
        }
    }
}
