using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class DetailOrders
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int Price { get; set; }
        public string Name { get; set; }
        public string OptionName { get; set; }
        public string Image { get; set; }
        public int? OrderId { get; set; }

        public virtual Orders Order { get; set; }
    }
}
