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
    public class ImportedCalendarsController : Controller
    {
        private readonly calendarContext _context;

        public ImportedCalendarsController(calendarContext context)
        {
            _context = context;
        }

        // GET: ImportedCalendars
        public async Task<IActionResult> Index(int userId)
        {
            var calendarContext = _context.ImportedCalendars.Include(i => i.User).Where(x => x.UserId == userId);
            return View(await calendarContext.ToListAsync());
        }

        // GET: ImportedCalendars/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.ImportedCalendars == null)
            {
                return NotFound();
            }

            var importedCalendar = await _context.ImportedCalendars
                .Include(i => i.User)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (importedCalendar == null)
            {
                return NotFound();
            }

            return View(importedCalendar);
        }

        // GET: ImportedCalendars/Create
        public IActionResult Create()
        {
            ViewData["UserId"] = new SelectList(_context.Users, "Id", "Id");
            return View();
        }

        // POST: ImportedCalendars/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Visible,UserId")] ImportedCalendar importedCalendar)
        {
            if (ModelState.IsValid)
            {
                _context.Add(importedCalendar);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["UserId"] = new SelectList(_context.Users, "Id", "Id", importedCalendar.UserId);
            return View(importedCalendar);
        }

        // GET: ImportedCalendars/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.ImportedCalendars == null)
            {
                return NotFound();
            }

            var importedCalendar = await _context.ImportedCalendars.FindAsync(id);
            if (importedCalendar == null)
            {
                return NotFound();
            }
            ViewData["UserId"] = new SelectList(_context.Users, "Id", "Id", importedCalendar.UserId);
            return View(importedCalendar);
        }

        // POST: ImportedCalendars/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Visible,UserId")] ImportedCalendar importedCalendar)
        {
            if (id != importedCalendar.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(importedCalendar);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ImportedCalendarExists(importedCalendar.Id))
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
            ViewData["UserId"] = new SelectList(_context.Users, "Id", "Id", importedCalendar.UserId);
            return View(importedCalendar);
        }

        // GET: ImportedCalendars/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.ImportedCalendars == null)
            {
                return NotFound();
            }

            var importedCalendar = await _context.ImportedCalendars
                .Include(i => i.User)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (importedCalendar == null)
            {
                return NotFound();
            }

            return View(importedCalendar);
        }

        // POST: ImportedCalendars/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.ImportedCalendars == null)
            {
                return Problem("Entity set 'calendarContext.ImportedCalendars'  is null.");
            }
            var importedCalendar = await _context.ImportedCalendars.FindAsync(id);
            if (importedCalendar != null)
            {
                _context.ImportedCalendars.Remove(importedCalendar);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ImportedCalendarExists(int id)
        {
          return (_context.ImportedCalendars?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
