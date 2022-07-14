using System;
using System.Collections.Generic;

namespace calendar_api.Models
{
    public partial class ImportedCalendar
    {
        public ImportedCalendar()
        {
            Events = new HashSet<Event>();
        }

        public int Id { get; set; }
        public string? Name { get; set; }
        public bool? Visible { get; set; }
        public int UserId { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual ICollection<Event> Events { get; set; }
    }
}
