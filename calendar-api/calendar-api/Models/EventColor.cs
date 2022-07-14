using System;
using System.Collections.Generic;

namespace calendar_api.Models
{
    public partial class EventColor
    {
        public EventColor()
        {
            Events = new HashSet<Event>();
        }

        public int Id { get; set; }
        public string? Description { get; set; }
        public string? PrimaryColor { get; set; }
        public string? SecondaryColor { get; set; }

        public virtual ICollection<Event> Events { get; set; }
    }
}
