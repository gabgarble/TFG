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
    public class EventsController : Controller
    {
        private readonly calendarContext _context;

        public EventsController(calendarContext context)
        {
            _context = context;
        }

        // GET: Events
        public async Task<IActionResult> Index()
        {
            var calendarContext = _context.Events.Include(x => x.Calendar).Include(x => x.EventColor).Include(x => x.UserCreator);
            return View(await calendarContext.ToListAsync());
        }

        // GET: Events/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Events == null)
            {
                return NotFound();
            }

            var xevent = await _context.Events
                .Include(x => x.Calendar)
                .Include(x => x.EventColor)
                .Include(x => x.UserCreator)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (xevent == null)
            {
                return NotFound();
            }

            return View(xevent);
        }

        // GET: Events/Create
        public IActionResult Create()
        {
            ViewData["CalendarId"] = new SelectList(_context.ImportedCalendars, "Id", "Id");
            ViewData["EventColorId"] = new SelectList(_context.EventColors, "Id", "Id");
            ViewData["UserCreatorId"] = new SelectList(_context.Users, "Id", "Id");
            return View();
        }

        // POST: Events/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,StartDate,EndDate,Title,AllDay,ResizableBeforeStart,ResizableBeforeEnd,Draggable,UserCreatorId,EventColorId,CalendarId")] Event xevent)
        {
            if (ModelState.IsValid)
            {
                _context.Add(xevent);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalendarId"] = new SelectList(_context.ImportedCalendars, "Id", "Id", xevent.CalendarId);
            ViewData["EventColorId"] = new SelectList(_context.EventColors, "Id", "Id", xevent.EventColorId);
            ViewData["UserCreatorId"] = new SelectList(_context.Users, "Id", "Id", xevent.UserCreatorId);
            return View(xevent);
        }

        // GET: Events/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Events == null)
            {
                return NotFound();
            }

            var xevent = await _context.Events.FindAsync(id);
            if (xevent == null)
            {
                return NotFound();
            }
            ViewData["CalendarId"] = new SelectList(_context.ImportedCalendars, "Id", "Id", xevent.CalendarId);
            ViewData["EventColorId"] = new SelectList(_context.EventColors, "Id", "Id", xevent.EventColorId);
            ViewData["UserCreatorId"] = new SelectList(_context.Users, "Id", "Id", xevent.UserCreatorId);
            return View(xevent);
        }

        // POST: Events/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,StartDate,EndDate,Title,AllDay,ResizableBeforeStart,ResizableBeforeEnd,Draggable,UserCreatorId,EventColorId,CalendarId")] Event xevent)
        {
            if (id != xevent.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(xevent);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventExists(xevent.Id))
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
            ViewData["CalendarId"] = new SelectList(_context.ImportedCalendars, "Id", "Id", xevent.CalendarId);
            ViewData["EventColorId"] = new SelectList(_context.EventColors, "Id", "Id", xevent.EventColorId);
            ViewData["UserCreatorId"] = new SelectList(_context.Users, "Id", "Id", xevent.UserCreatorId);
            return View(xevent);
        }

        // GET: Events/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Events == null)
            {
                return NotFound();
            }

            var xevent = await _context.Events
                .Include(x => x.Calendar)
                .Include(x => x.EventColor)
                .Include(x => x.UserCreator)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (xevent == null)
            {
                return NotFound();
            }

            return View(xevent);
        }

        // POST: Events/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Events == null)
            {
                return Problem("Entity set 'calendarContext.Events'  is null.");
            }
            var xevent = await _context.Events.FindAsync(id);
            if (xevent != null)
            {
                _context.Events.Remove(xevent);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EventExists(int id)
        {
          return (_context.Events?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
