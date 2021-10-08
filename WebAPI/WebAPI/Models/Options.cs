using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Options
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public int Price { get; set; }

        public virtual Products Product { get; set; }
    }
}
