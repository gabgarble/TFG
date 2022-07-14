using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using calendar_api.Models;

namespace calendar_api.Controllers
{
    public class UserPetitionsController : Controller
    {
        private readonly calendarContext _context;

        public UserPetitionsController(calendarContext context)
        {
            _context = context;
        }

        // GET: UserPetitions
        public async Task<IActionResult> Index()
        {
            var calendarContext = _context.UserPetitions.Include(u => u.PetitionEstatus).Include(u => u.UserReceiver).Include(u => u.UserSender);
            return View(await calendarContext.ToListAsync());
        }

        // GET: UserPetitions/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.UserPetitions == null)
            {
                return NotFound();
            }

            var userPetition = await _context.UserPetitions
                .Include(u => u.PetitionEstatus)
                .Include(u => u.UserReceiver)
                .Include(u => u.UserSender)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (userPetition == null)
            {
                return NotFound();
            }

            return View(userPetition);
        }

        // GET: UserPetitions/Create
        public IActionResult Create()
        {
            ViewData["PetitionEstatusId"] = new SelectList(_context.PetitionStatuses, "Id", "Id");
            ViewData["UserReceiverId"] = new SelectList(_context.Users, "Id", "Id");
            ViewData["UserSenderId"] = new SelectList(_context.Users, "Id", "Id");
            return View();
        }

        // POST: UserPetitions/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,UserSenderId,UserReceiverId,PetitionEstatusId")] UserPetition userPetition)
        {
            if (ModelState.IsValid)
            {
                _context.Add(userPetition);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["PetitionEstatusId"] = new SelectList(_context.PetitionStatuses, "Id", "Id", userPetition.PetitionEstatusId);
            ViewData["UserReceiverId"] = new SelectList(_context.Users, "Id", "Id", userPetition.UserReceiverId);
            ViewData["UserSenderId"] = new SelectList(_context.Users, "Id", "Id", userPetition.UserSenderId);
            return View(userPetition);
        }

        // GET: UserPetitions/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.UserPetitions == null)
            {
                return NotFound();
            }

            var userPetition = await _context.UserPetitions.FindAsync(id);
            if (userPetition == null)
            {
                return NotFound();
            }
            ViewData["PetitionEstatusId"] = new SelectList(_context.PetitionStatuses, "Id", "Id", userPetition.PetitionEstatusId);
            ViewData["UserReceiverId"] = new SelectList(_context.Users, "Id", "Id", userPetition.UserReceiverId);
            ViewData["UserSenderId"] = new SelectList(_context.Users, "Id", "Id", userPetition.UserSenderId);
            return View(userPetition);
        }

        // POST: UserPetitions/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,UserSenderId,UserReceiverId,PetitionEstatusId")] UserPetition userPetition)
        {
            if (id != userPetition.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(userPetition);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserPetitionExists(userPetition.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["PetitionEstatusId"] = new SelectList(_context.PetitionStatuses, "Id", "Id", userPetition.PetitionEstatusId);
            ViewData["UserReceiverId"] = new SelectList(_context.Users, "Id", "Id", userPetition.UserReceiverId);
            ViewData["UserSenderId"] = new SelectList(_context.Users, "Id", "Id", userPetition.UserSenderId);
            return View(userPetition);
        }

        // GET: UserPetitions/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.UserPetitions == null)
            {
                return NotFound();
            }

            var userPetition = await _context.UserPetitions
                .Include(u => u.PetitionEstatus)
                .Include(u => u.UserReceiver)
                .Include(u => u.UserSender)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (userPetition == null)
            {
                return NotFound();
            }

            return View(userPetition);
        }

        // POST: UserPetitions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.UserPetitions == null)
            {
                return Problem("Entity set 'calendarContext.UserPetitions'  is null.");
            }
            var userPetition = await _context.UserPetitions.FindAsync(id);
            if (userPetition != null)
            {
                _context.UserPetitions.Remove(userPetition);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool UserPetitionExists(int id)
        {
          return (_context.UserPetitions?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
