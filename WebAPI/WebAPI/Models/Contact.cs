using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Contact
    {
        public int Id { get; set; }
        public string Logo { get; set; }
        public string Name { get; set; }
        public string WorkTime { get; set; }
        public string Hotline { get; set; }
        public string Address { get; set; }
        public string Content { get; set; }
    }
}
