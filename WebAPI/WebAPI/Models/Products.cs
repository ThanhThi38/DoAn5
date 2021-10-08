using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Products
    {
        public Products()
        {
            Carts = new HashSet<Carts>();
            Images = new HashSet<Images>();
            Options = new HashSet<Options>();
        }

        public int Id { get; set; }
        public int? CategoryId { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public byte? Sale { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public bool Status { get; set; }
        public int? Price { get; set; }

        public virtual Categories Category { get; set; }
        public virtual ICollection<Carts> Carts { get; set; }
        public virtual ICollection<Images> Images { get; set; }
        public virtual ICollection<Options> Options { get; set; }
    }
}
