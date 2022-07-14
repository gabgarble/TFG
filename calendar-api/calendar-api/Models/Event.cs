using System;
using System.Collections.Generic;

namespace calendar_api.Models
{
    public partial class Event
    {
        public Event()
        {
            UserEventRelations = new HashSet<UserEventRelation>();
        }

        public int Id { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Title { get; set; }
        public bool? AllDay { get; set; }
        public bool? ResizableBeforeStart { get; set; }
        public bool? ResizableBeforeEnd { get; set; }
        public bool? Draggable { get; set; }
        public int UserCreatorId { get; set; }
        public int EventColorId { get; set; }
        public int? CalendarId { get; set; }

        public virtual ImportedCalendar? Calendar { get; set; }
        public virtual EventColor EventColor { get; set; } = null!;
        public virtual User UserCreator { get; set; } = null!;
        public virtual ICollection<UserEventRelation> UserEventRelations { get; set; }
    }
}
