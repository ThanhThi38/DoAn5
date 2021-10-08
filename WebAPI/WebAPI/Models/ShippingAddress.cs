using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class ShippingAddress
    {
        public ShippingAddress()
        {
            Orders = new HashSet<Orders>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

        public virtual ICollection<Orders> Orders { get; set; }
    }
}
