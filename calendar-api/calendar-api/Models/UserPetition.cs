using System;
using System.Collections.Generic;

namespace calendar_api.Models
{
    public partial class UserPetition
    {
        public int Id { get; set; }
        public int UserSenderId { get; set; }
        public int UserReceiverId { get; set; }
        public int PetitionEstatusId { get; set; }

        public virtual PetitionStatus PetitionEstatus { get; set; } = null!;
        public virtual User UserReceiver { get; set; } = null!;
        public virtual User UserSender { get; set; } = null!;
    }
}
