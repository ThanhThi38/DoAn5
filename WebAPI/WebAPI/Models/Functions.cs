using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Functions
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public int? ParentId { get; set; }
        public byte? SortOrder { get; set; }
        public byte? Status { get; set; }
    }
}
