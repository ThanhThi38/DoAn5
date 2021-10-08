using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Customers
    {
        public Customers()
        {
            Addresses = new HashSet<Addresses>();
            Carts = new HashSet<Carts>();
            Orders = new HashSet<Orders>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Image { get; set; }

        public virtual ICollection<Addresses> Addresses { get; set; }
        public virtual ICollection<Carts> Carts { get; set; }
        public virtual ICollection<Orders> Orders { get; set; }
    }
}
