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
    public class PetitionStatusController : Controller
    {
        private readonly calendarContext _context;

        public PetitionStatusController(calendarContext context)
        {
            _context = context;
        }

        // GET: PetitionStatus
        public async Task<IActionResult> Index()
        {
              return _context.PetitionStatuses != null ? 
                          View(await _context.PetitionStatuses.ToListAsync()) :
                          Problem("Entity set 'calendarContext.PetitionStatuses'  is null.");
        }

        // GET: PetitionStatus/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.PetitionStatuses == null)
            {
                return NotFound();
            }

            var petitionStatus = await _context.PetitionStatuses
                .FirstOrDefaultAsync(m => m.Id == id);
            if (petitionStatus == null)
            {
                return NotFound();
            }

            return View(petitionStatus);
        }

        // GET: PetitionStatus/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: PetitionStatus/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Status")] PetitionStatus petitionStatus)
        {
            if (ModelState.IsValid)
            {
                _context.Add(petitionStatus);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(petitionStatus);
        }

        // GET: PetitionStatus/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.PetitionStatuses == null)
            {
                return NotFound();
            }

            var petitionStatus = await _context.PetitionStatuses.FindAsync(id);
            if (petitionStatus == null)
            {
                return NotFound();
            }
            return View(petitionStatus);
        }

        // POST: PetitionStatus/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Status")] PetitionStatus petitionStatus)
        {
            if (id != petitionStatus.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(petitionStatus);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PetitionStatusExists(petitionStatus.Id))
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
            return View(petitionStatus);
        }

        // GET: PetitionStatus/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.PetitionStatuses == null)
            {
                return NotFound();
            }

            var petitionStatus = await _context.PetitionStatuses
                .FirstOrDefaultAsync(m => m.Id == id);
            if (petitionStatus == null)
            {
                return NotFound();
            }

            return View(petitionStatus);
        }

        // POST: PetitionStatus/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.PetitionStatuses == null)
            {
                return Problem("Entity set 'calendarContext.PetitionStatuses'  is null.");
            }
            var petitionStatus = await _context.PetitionStatuses.FindAsync(id);
            if (petitionStatus != null)
            {
                _context.PetitionStatuses.Remove(petitionStatus);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PetitionStatusExists(int id)
        {
          return (_context.PetitionStatuses?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
