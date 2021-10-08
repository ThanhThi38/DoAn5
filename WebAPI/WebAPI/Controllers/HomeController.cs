using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Models;
using BC = BCrypt.Net.BCrypt;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly doan5Context _context;

        public HomeController(doan5Context context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Home()
        {
            var category = _context.Categories.Select(c => new {
                c.Name,
                c.Slug,
                c.Status
            }).Where(c => c.Status == true).ToList();
            return Ok(category);
        }

        [HttpGet, Route("get-product")]
        public IActionResult getProduct()
        {
            var hotPro = _context.Products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Slug,
                p.Price,
                p.Sale,
                p.Status,
                Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
            }).OrderByDescending(p => p.Sale).Where(p => p.Status == true).Take(5).ToList();
            var newPro = _context.Products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Slug,
                p.Price,
                p.Sale,
                p.Status,
                Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
            }).OrderByDescending(p=> p.Id).Where(p => p.Status == true).Take(5).ToList();
            var feature = _context.Products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Slug,
                p.Price,
                p.Sale,
                p.Status,
                Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
            }).OrderByDescending(p => p.Price).Where(p => p.Status == true).Take(5).ToList();
            return Ok(new { hotDeal = hotPro, newProduct = newPro, featured = feature });
        }

        [HttpGet, Route("list-product/{id}")]
        public IActionResult ListProduct(string id)
        {
            var cate = _context.Categories.Select(c => new {
                c.Id,
                c.Slug
            }).FirstOrDefault(l => l.Slug == id);
            if (cate == null)
            {
                return NotFound();
            }
            var list = _context.Products
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Sale,
                    p.Description,
                    p.CategoryId,
                    p.Status,
                    Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                })
                .Where(l => l.CategoryId == cate.Id && l.Status == true);
            return Ok(list);
        }

        [HttpGet, Route("get-page/{id}/{first}/{rows}/{sort}")]
        public IActionResult GetPage(string id,int first, int rows, string sort = "")
        {
            var cate = _context.Categories.Select(c => new {
                c.Id,
                c.Slug
            }).FirstOrDefault(l => l.Slug == id);
            if (cate == null)
            {
                return NotFound();
            }
            if (sort == "default")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .Where(l => l.CategoryId == cate.Id && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if(sort == "new")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderByDescending(p => p.Id)
                    .Where(l => l.CategoryId == cate.Id && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if (sort == "nameAsc")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderBy(p => p.Name)
                    .Where(l => l.CategoryId == cate.Id && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if (sort == "nameDesc")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderByDescending(p => p.Name)
                    .Where(l => l.CategoryId == cate.Id && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if (sort == "priceAsc")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderBy(p => p.Price - (p.Price * p.Sale/100))
                    .Where(l => l.CategoryId == cate.Id && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if (sort == "priceDesc")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderByDescending(p => p.Price - (p.Price * p.Sale / 100))
                    .Where(l => l.CategoryId == cate.Id && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            }
            return Ok(BadRequest());
        }

        [HttpGet, Route("get-detail/{id}")]
        public IActionResult GetDetail(string id)
        {
            var product = _context.Products
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Slug,
                    p.CategoryId,
                    p.Price,
                    p.Sale,
                    p.Description,
                    p.Content,
                    Images = _context.Images.Where(i => i.ProductId == p.Id).ToList(),
                    Options = _context.Options.Where(o => o.ProductId == p.Id).ToList(),
                    Related = _context.Products.Select(r => new
                    {
                        r.Id,
                        r.Name,
                        r.Slug,
                        r.Price,
                        r.Sale,
                        r.CategoryId,
                        r.Status,
                        Images = _context.Images.Where(i => i.ProductId == r.Id).ToList()
                    }).Where(x => x.CategoryId == p.CategoryId && x.Id != p.Id && x.Status == true).ToList()
                }).FirstOrDefault(p => p.Slug == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost, Route("register")]
        public async Task<ActionResult<Customers>> Register(Customers customer)
        {
            Customers c = new Customers();
            c.Name = customer.Name;
            c.Phone = customer.Phone;
            c.Email = customer.Email;
            c.Password = BC.HashPassword(customer.Password);
            c.Image = "pngtree-hand-drawn-flat-wind-user-avatar-icon-png-image_4492039.jpg";
            _context.Customers.Add(c);
            await _context.SaveChangesAsync();
            return Ok(customer);
        }

        [HttpPost, Route("login")]
        public IActionResult login(Customers customer)
        {
            if (customer == null)
                return BadRequest("Dữ liệu nhập vào không hợp lệ!");
            if ((customer = CustomerExits(customer.Email, customer.Password)) != null)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                var tokeOptions = new JwtSecurityToken(
                    //issuer: "http://localhost:5001",
                    //audience: "http://localhost:5001",
                    claims: new List<Claim>(),
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString, customer });
            }
            else
            {
                return Unauthorized("Email hoặc mật khẩu không hợp lệ.");
            }
        }

        [HttpPut("change-pass/{id}")]
        public IActionResult changePass(int id, [FromBody] Customers customer)
        {
            var c = _context.Customers.Find(id);
            if (c == null) {
                return BadRequest("Tài khoản không tồn tại");
            }
            c.Password = BC.HashPassword(customer.Password);
            _context.SaveChanges();
            return Ok(new { message = "Thay đổi mật khẩu thành công." });
        }

        public Customers CustomerExits(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return null;
            var user = _context.Customers.SingleOrDefault(e => e.Email == email);
            if (user == null)
                return null;

            if (!BC.Verify(password, user.Password))
            {
                return null;
            }
            return user;
        }

        [HttpGet, Route("search/{id}/{first}/{rows}/{sort}")]
        public IActionResult Search(string id, int first, int rows, string sort="")
        {
            if (sort == "default")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .Where(l => l.Name.Contains(id) && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if(sort == "new")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderByDescending(p => p.Id)
                    .Where(l => l.Name.Contains(id) && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if (sort == "nameAsc")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderBy(p => p.Name)
                    .Where(l => l.Name.Contains(id) && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if (sort == "nameDesc")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderByDescending(p => p.Name)
                    .Where(l => l.Name.Contains(id) && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if (sort == "priceAsc")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderBy(p => p.Price - (p.Price * p.Sale/100))
                    .Where(l => l.Name.Contains(id) && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            } else if (sort == "priceDesc")
            {
                var res = _context.Products
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Slug,
                        p.Price,
                        p.Sale,
                        p.Description,
                        p.CategoryId,
                        p.Status,
                        Images = _context.Images.Where(i => i.ProductId == p.Id).ToList()
                    })
                    .OrderByDescending(p => p.Price - (p.Price * p.Sale / 100))
                    .Where(l => l.Name.Contains(id) && l.Status == true)
                    .Skip(first).Take(rows);
                return Ok(res);
            }
            return Ok(BadRequest());
        }


        [HttpPost, Route("add-cart")]
        public IActionResult AddCart(Carts cart)
        {
            var product = _context.Carts.SingleOrDefault(p => p.CustomerId == cart.CustomerId && p.ProductId == cart.ProductId && p.OptionName == cart.OptionName);
            if (product != null)
            {
                product.Quantity += cart.Quantity;
                _context.SaveChanges();
            }
            else
            {
                Carts c = new Carts();
                c.CustomerId = cart.CustomerId;
                c.ProductId = cart.ProductId;
                c.Quantity = cart.Quantity;
                c.OptionName = cart.OptionName;
                _context.Carts.Add(c);
                _context.SaveChanges();
            }
            return Ok(cart);
        }

        [HttpGet, Route("get-cart/{id}")]
        public IActionResult GetCart(int id)
        {
            var cart = _context.Carts.Select(c => new
            {
                c.Id,
                c.CustomerId,
                c.ProductId,
                c.OptionName,
                c.Quantity,
                Products = _context.Products.Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Slug,
                    p.Price,
                    p.Sale,
                    Images = _context.Images.First(i => i.ProductId == p.Id),
                    Options = _context.Options.Select(o => new
                    {
                        o.Name,
                        o.Price
                    }).First(o => o.Name == c.OptionName)
                }).First(p => p.Id == c.ProductId)
            }).Where(c => c.CustomerId == id);
            return Ok(cart);
        }

        [HttpDelete, Route("remove-item/{id}")]
        public IActionResult RemoveItem(int id)
        {
            var cart = _context.Carts.Find(id);
            if (cart == null)
            {
                return NotFound();
            }
            _context.Carts.Remove(cart);
            _context.SaveChanges();
            return Ok(cart);
        }

        [HttpPost, Route("change-quantity")]
        public IActionResult ChangeQuantity(Carts cart)
        {
            var c = _context.Carts.First(c => c.Id == cart.Id);
            if (c == null)
            {
                return BadRequest();
            }
            c.Quantity = cart.Quantity;
            _context.SaveChanges();
            return Ok(cart.Quantity);
        }

        [HttpPost, Route("add-order")]
        public ActionResult AddOrder([FromBody] Orders data)
        {
            ShippingAddress sa = new ShippingAddress();
            sa.Name = data.Shipping.Name;
            sa.Phone = data.Shipping.Phone;
            sa.Address = data.Shipping.Address;
            _context.ShippingAddress.Add(sa);
            _context.SaveChanges();

            Orders od = new Orders();
            od.CustomerId = data.CustomerId;
            od.AddressId = sa.Id;
            od.CreatedAt = DateTime.Now;
            od.PaymentId = data.PaymentId;
            od.Status = 1;
            _context.Orders.Add(od);
            _context.SaveChanges();

            var order = _context.Carts.Where(o => o.CustomerId == data.CustomerId).ToList();
            foreach (var item in order)
            {
                var product = _context.Products.Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Sale,
                    Images = _context.Images.First(i => i.ProductId == p.Id),
                    Options = _context.Options.First(o => o.ProductId == p.Id)
                }).First(x => x.Id == item.ProductId);
                DetailOrders dt = new DetailOrders();
                dt.OrderId = od.Id;
                dt.Name = product.Name;
                dt.OptionName = item.OptionName;
                dt.Image = product.Images.Name;
                dt.Quantity = item.Quantity;
                dt.Price = (int)(product.Price - (product.Price * product.Sale / 100) + product.Options.Price);
                _context.DetailOrders.Add(dt);
                _context.SaveChanges();
            }
            _context.Carts.RemoveRange(order);
            _context.SaveChanges();

            return Ok(data);
        }

        [HttpGet("history/{id}/{first}/{rows}")]
        public IActionResult getOrder(int id, int first, int rows)
        {
            var listOrder = _context.Orders.Select(o => new
            {
                o.Id,
                o.CustomerId,
                o.CreatedAt,
                o.PaymentId,
                o.AddressId,
                o.Status,
                Shipping = _context.ShippingAddress.First(s => s.Id == o.AddressId),
                DetailOrders = _context.DetailOrders.Where(t => t.OrderId == o.Id).ToList(),
                PaymentMethods = _context.PaymentMethods.First(p => p.Id == o.PaymentId)
            }).OrderByDescending(d => d.CreatedAt).Where(e => e.CustomerId == id).Skip(first).Take(rows).ToList();
            return Ok(new { list = listOrder, total = listOrder.Count() });
        }

        [HttpGet("show-history/{id}")]
        public IActionResult showHistory(int id)
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
                detailOrders = _context.DetailOrders.Where(t => t.OrderId == o.Id).ToList(),
                PaymentMethods = _context.PaymentMethods.First(p => p.Id == o.PaymentId)
            }).First(x => x.Id == id);
            return Ok(res);
        }
    }
}
