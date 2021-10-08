using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Addresses
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public int? CustomerId { get; set; }
        public bool Active { get; set; }

        public virtual Customers Customer { get; set; }
    }
}
