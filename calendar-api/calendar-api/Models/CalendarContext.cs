using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace calendar_api.Models
{
    public partial class calendarContext : DbContext
    {
        public calendarContext()
        {
        }

        public calendarContext(DbContextOptions<calendarContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Event> Events { get; set; } = null!;
        public virtual DbSet<EventColor> EventColors { get; set; } = null!;
        public virtual DbSet<ImportedCalendar> ImportedCalendars { get; set; } = null!;
        public virtual DbSet<PetitionStatus> PetitionStatuses { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<UserEventRelation> UserEventRelations { get; set; } = null!;
        public virtual DbSet<UserPetition> UserPetitions { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=DESKTOP-K88M24T;Database=calendar;Trusted_Connection=True");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>(entity =>
            {
                entity.ToTable("Event");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AllDay).HasColumnName("allDay");

                entity.Property(e => e.CalendarId).HasColumnName("calendarId");

                entity.Property(e => e.Draggable).HasColumnName("draggable");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("endDate");

                entity.Property(e => e.EventColorId).HasColumnName("eventColorId");

                entity.Property(e => e.ResizableBeforeEnd).HasColumnName("resizableBeforeEnd");

                entity.Property(e => e.ResizableBeforeStart).HasColumnName("resizableBeforeStart");

                entity.Property(e => e.StartDate)
                    .HasColumnType("datetime")
                    .HasColumnName("startDate");

                entity.Property(e => e.Title)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("title");

                entity.Property(e => e.UserCreatorId).HasColumnName("userCreatorId");

                entity.HasOne(d => d.Calendar)
                    .WithMany(p => p.Events)
                    .HasForeignKey(d => d.CalendarId)
                    .HasConstraintName("fk_event_importedCalendar");

                entity.HasOne(d => d.EventColor)
                    .WithMany(p => p.Events)
                    .HasForeignKey(d => d.EventColorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_eventn_eventColor");

                entity.HasOne(d => d.UserCreator)
                    .WithMany(p => p.Events)
                    .HasForeignKey(d => d.UserCreatorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_event_user");
            });

            modelBuilder.Entity<EventColor>(entity =>
            {
                entity.ToTable("EventColor");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Description)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("description");

                entity.Property(e => e.PrimaryColor)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("primaryColor");

                entity.Property(e => e.SecondaryColor)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("secondaryColor");
            });

            modelBuilder.Entity<ImportedCalendar>(entity =>
            {
                entity.ToTable("ImportedCalendar");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("name");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.Property(e => e.Visible).HasColumnName("visible");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.ImportedCalendars)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_importedCalendar_user");
            });

            modelBuilder.Entity<PetitionStatus>(entity =>
            {
                entity.ToTable("PetitionStatus");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Status)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("status");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Avatar)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("avatar");

                entity.Property(e => e.Email)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.LastConnection)
                    .HasColumnType("datetime")
                    .HasColumnName("lastConnection");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("name");

                entity.Property(e => e.Password)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("password");

                entity.Property(e => e.Surname)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("surname");

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("username");
            });

            modelBuilder.Entity<UserEventRelation>(entity =>
            {
                entity.ToTable("UserEventRelation");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.EventId).HasColumnName("eventId");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.UserEventRelations)
                    .HasForeignKey(d => d.EventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_userEventRelation_event");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserEventRelations)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_userEventRelation_user");
            });

            modelBuilder.Entity<UserPetition>(entity =>
            {
                entity.ToTable("UserPetition");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.PetitionEstatusId).HasColumnName("petitionEstatusId");

                entity.Property(e => e.UserReceiverId).HasColumnName("userReceiverId");

                entity.Property(e => e.UserSenderId).HasColumnName("userSenderId");

                entity.HasOne(d => d.PetitionEstatus)
                    .WithMany(p => p.UserPetitions)
                    .HasForeignKey(d => d.PetitionEstatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_userPetition_petitionStatus");

                entity.HasOne(d => d.UserReceiver)
                    .WithMany(p => p.UserPetitionUserReceivers)
                    .HasForeignKey(d => d.UserReceiverId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_userPetition_userReceiverId");

                entity.HasOne(d => d.UserSender)
                    .WithMany(p => p.UserPetitionUserSenders)
                    .HasForeignKey(d => d.UserSenderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_userPetition_userSenderIf");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
