using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class UserRole
    {
        public int? UserId { get; set; }
        public int? RoleId { get; set; }

        public virtual Roles Role { get; set; }
        public virtual Users User { get; set; }
    }
}
