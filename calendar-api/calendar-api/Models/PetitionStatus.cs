using System;
using System.Collections.Generic;

namespace calendar_api.Models
{
    public partial class PetitionStatus
    {
        public PetitionStatus()
        {
            UserPetitions = new HashSet<UserPetition>();
        }

        public int Id { get; set; }
        public string? Status { get; set; }

        public virtual ICollection<UserPetition> UserPetitions { get; set; }
    }
}
