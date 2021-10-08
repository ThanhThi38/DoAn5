using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Carts
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public int? ProductId { get; set; }
        public string OptionName { get; set; }
        public int Quantity { get; set; }

        public virtual Customers Customer { get; set; }
        public virtual Products Product { get; set; }
    }
}
