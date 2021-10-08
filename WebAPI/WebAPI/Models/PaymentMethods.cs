using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace WebAPI.Models
{
    public partial class PaymentMethods
    {
        public PaymentMethods()
        {
            Orders = new HashSet<Orders>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }

        public virtual ICollection<Orders> Orders { get; set; }
    }
}
