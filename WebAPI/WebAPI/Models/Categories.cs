using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Categories
    {
        public Categories()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public byte? SortOrder { get; set; }
        public bool Status { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
