using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class Permissions
    {
        public int? RoleId { get; set; }
        public int? FunctionId { get; set; }
        public int? ActionId { get; set; }

        public virtual Functions Function { get; set; }
        public virtual Roles Role { get; set; }
    }
}
