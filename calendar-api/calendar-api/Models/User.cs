using System;
using System.Collections.Generic;

namespace calendar_api.Models
{
    public partial class User
    {
        public User()
        {
            Events = new HashSet<Event>();
            ImportedCalendars = new HashSet<ImportedCalendar>();
            UserEventRelations = new HashSet<UserEventRelation>();
            UserPetitionUserReceivers = new HashSet<UserPetition>();
            UserPetitionUserSenders = new HashSet<UserPetition>();
        }

        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Avatar { get; set; }
        public DateTime? LastConnection { get; set; }

        public virtual ICollection<Event> Events { get; set; }
        public virtual ICollection<ImportedCalendar> ImportedCalendars { get; set; }
        public virtual ICollection<UserEventRelation> UserEventRelations { get; set; }
        public virtual ICollection<UserPetition> UserPetitionUserReceivers { get; set; }
        public virtual ICollection<UserPetition> UserPetitionUserSenders { get; set; }
    }
}
