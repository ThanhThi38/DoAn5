using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Users
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
    }
}
