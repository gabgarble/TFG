using System;
using System.Collections.Generic;

namespace calendar_api.Models
{
    public partial class UserEventRelation
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }

        public virtual Event Event { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
