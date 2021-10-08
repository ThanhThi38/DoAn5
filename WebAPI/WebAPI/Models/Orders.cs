using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Orders
    {
        public Orders()
        {
            DetailOrders = new HashSet<DetailOrders>();
        }

        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public int? AddressId { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? PaymentId { get; set; }
        public byte Status { get; set; }

        public virtual ShippingAddress Shipping { get; set; }
        public virtual Customers Customer { get; set; }
        public virtual PaymentMethods Payment { get; set; }
        public virtual ICollection<DetailOrders> DetailOrders { get; set; }
    }
}
