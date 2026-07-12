/**
 * CT Studio NZ — Booking Calendar
 * Reads real-time busy slots from Google Calendar API (public calendar).
 *
 * SETUP REQUIRED:
 *  1. Go to Google Calendar → Settings for ctstudionz89@gmail.com calendar
 *  2. Under "Share with specific people or groups" → make it public OR add a service account
 *  3. Under "Integrate calendar" copy the Calendar ID (looks like an email or long string)
 *  4. Go to console.cloud.google.com → create a project → enable "Google Calendar API"
 *  5. Put the key in .env as GOOGLE_CALENDAR_API_KEY, then run `npm run generate-config`
 *     (this writes js/config.js, which is gitignored and loaded before this file)
 */

const CAL_CONFIG = {
  // Defaults — overridden by window.CAL_CONFIG from js/config.js if present
  API_KEY: 'YOUR_GOOGLE_CALENDAR_API_KEY',
  CALENDAR_ID: 'ctstudionz89@gmail.com',
  WA_NUMBER: '64224663080',

  // Time slots to show: 8am (8) to 6pm (18)
  HOURS: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],

  ...(window.CAL_CONFIG || {}),
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function padZ(n) { return String(n).padStart(2, '0'); }

function formatHour(h) {
  if (h === 0) return '12am';
  if (h < 12) return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

function isoDate(d) {
  return `${d.getFullYear()}-${padZ(d.getMonth() + 1)}-${padZ(d.getDate())}`;
}

function dateFull(d) {
  return `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function startOfDay(d) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

// ── State ─────────────────────────────────────────────────────────────────────

const state = {
  today: startOfDay(new Date()),
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth(),
  selectedDate: null,
  selectedHour: null,
  busyHours: [],
  loadingSlots: false,
};

// ── Google Calendar Fetch ─────────────────────────────────────────────────────

async function fetchBusySlots(date) {
  state.loadingSlots = true;
  state.busyHours = [];
  renderCalendar();

  // If no real API key, show demo mode
  if (!CAL_CONFIG.API_KEY || CAL_CONFIG.API_KEY === 'YOUR_GOOGLE_CALENDAR_API_KEY') {
    await new Promise(r => setTimeout(r, 400)); // simulate network
    state.loadingSlots = false;
    // Demo: randomly block a couple of hours for demonstration
    state.busyHours = [10, 14];
    renderCalendar();
    return;
  }

  try {
    const timeMin = new Date(date);
    timeMin.setHours(0, 0, 0, 0);
    const timeMax = new Date(date);
    timeMax.setHours(23, 59, 59, 0);

    const url = new URL('https://www.googleapis.com/calendar/v3/freeBusy');
    url.searchParams.set('key', CAL_CONFIG.API_KEY);

    const body = {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: CAL_CONFIG.CALENDAR_ID }],
    };

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const busyPeriods = data?.calendars?.[CAL_CONFIG.CALENDAR_ID]?.busy || [];

    // Convert busy periods to blocked hours
    const blocked = new Set();
    busyPeriods.forEach(({ start, end }) => {
      const s = new Date(start);
      const e = new Date(end);
      CAL_CONFIG.HOURS.forEach(h => {
        const slotStart = new Date(date);
        slotStart.setHours(h, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(h + 1, 0, 0, 0);
        // Overlapping if the slot and busy period intersect
        if (slotStart < e && slotEnd > s) {
          blocked.add(h);
        }
      });
    });

    state.busyHours = [...blocked];
  } catch (err) {
    console.warn('Calendar fetch failed:', err);
    state.busyHours = [];
  }

  state.loadingSlots = false;
  renderCalendar();
}

// ── Build WhatsApp link ───────────────────────────────────────────────────────

function buildWALink() {
  if (!state.selectedDate || state.selectedHour === null) return '#';
  const msg =
    `Hi CT Studio NZ! I'd like to book a session.\n` +
    `📅 Date: ${dateFull(state.selectedDate)}\n` +
    `🕐 Time: ${formatHour(state.selectedHour)}\n\n` +
    `Name:\nPhone/Email:`;
  return `https://wa.me/${CAL_CONFIG.WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderCalendar() {
  const root = document.getElementById('calendarRoot');
  if (!root) return;

  const { viewYear, viewMonth, selectedDate, selectedHour, today, busyHours, loadingSlots } = state;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const canBook = selectedDate !== null && selectedHour !== null;

  root.innerHTML = `
    <div class="cal-header">
      <h2>Book Your Session</h2>
      <p>Pick a date and time — open slots are available instantly.</p>
    </div>

    <div class="cal-inner">
      <!-- Calendar card -->
      <div class="cal-card">
        <div class="cal-month-nav">
          <button class="cal-nav-btn" id="calPrev" aria-label="Previous month">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <span>${MONTHS[viewMonth]} ${viewYear}</span>
          <button class="cal-nav-btn" id="calNext" aria-label="Next month">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="cal-day-headers">
          ${DAYS_SHORT.map(d => `<span>${d}</span>`).join('')}
        </div>

        <div class="cal-days-grid">
          ${Array.from({ length: firstDay }).map(() => `<div class="cal-day-cell empty"></div>`).join('')}
          ${Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const cellDate = startOfDay(new Date(viewYear, viewMonth, day));
            const isPast = cellDate < today;
            const isToday = cellDate.getTime() === today.getTime();
            const isSelected = selectedDate && cellDate.getTime() === selectedDate.getTime();

            let cls = 'cal-day-cell';
            if (isPast) cls += ' past';
            else if (isSelected) cls += ' selected';
            else if (isToday) cls += ' today';

            return `<button class="${cls}" data-day="${day}" ${isPast ? 'disabled' : ''}>${day}</button>`;
          }).join('')}
        </div>

        <div class="cal-legend">
          <div class="cal-legend-item">
            <div class="cal-legend-dot" style="background:#fff;"></div> Available
          </div>
          <div class="cal-legend-item">
            <div class="cal-legend-dot" style="background:#111;"></div> Selected
          </div>
          <div class="cal-legend-item">
            <div class="cal-legend-dot" style="background:#f5f5f5;border-color:#eee;"></div> Past
          </div>
        </div>
      </div>

      <!-- Time slot picker -->
      ${selectedDate ? `
        <div class="cal-card">
          <div class="cal-section-title">${dateFull(selectedDate)} — choose a time</div>
          ${loadingSlots ? `<div class="cal-loading">Checking availability…</div>` : `
            <div class="cal-time-grid">
              ${CAL_CONFIG.HOURS.map(h => {
                const isBusy = busyHours.includes(h);
                const isSel = selectedHour === h;
                let cls = 'cal-time-slot';
                if (isBusy) cls += ' busy';
                else if (isSel) cls += ' selected';
                return `<button class="${cls}" data-hour="${h}" ${isBusy ? 'disabled title="Not available"' : ''}>${formatHour(h)}</button>`;
              }).join('')}
            </div>
            ${busyHours.length > 0 ? `<p style="font-size:0.75rem;color:#999;margin-top:10px;line-height:1.5;">Crossed-out times are already booked. Reach out anyway — we may be able to find something.</p>` : ''}
          `}
        </div>
      ` : `<div class="cal-placeholder">👆 Select a date above to see available times.</div>`}

      <!-- Summary & CTA -->
      ${canBook ? `
        <div class="cal-summary">
          <strong>Your booking request</strong>
          <span>${dateFull(selectedDate)}</span> &nbsp;·&nbsp;
          <span>${formatHour(selectedHour)}</span>
        </div>
        <a href="${buildWALink()}" target="_blank" rel="noopener noreferrer" class="cal-wa-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Send Booking via WhatsApp
        </a>
      ` : `<div class="cal-placeholder" style="margin-top:0;">Select a date and time above, then send your booking request via WhatsApp.</div>`}
    </div>
  `;

  // Attach event listeners
  document.getElementById('calPrev')?.addEventListener('click', () => {
    if (state.viewMonth === 0) { state.viewMonth = 11; state.viewYear--; }
    else state.viewMonth--;
    renderCalendar();
  });

  document.getElementById('calNext')?.addEventListener('click', () => {
    if (state.viewMonth === 11) { state.viewMonth = 0; state.viewYear++; }
    else state.viewMonth++;
    renderCalendar();
  });

  root.querySelectorAll('.cal-day-cell[data-day]').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.dataset.day, 10);
      const clicked = startOfDay(new Date(state.viewYear, state.viewMonth, day));
      if (clicked < state.today) return;
      state.selectedDate = clicked;
      state.selectedHour = null;
      state.busyHours = [];
      renderCalendar();
      fetchBusySlots(clicked);
    });
  });

  root.querySelectorAll('.cal-time-slot[data-hour]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('busy')) return;
      state.selectedHour = parseInt(btn.dataset.hour, 10);
      renderCalendar();
    });
  });
}

// ── Panel open/close (called from HTML) ──────────────────────────────────────

function closeBookingPanel() {
  document.getElementById('bookingPanel')?.classList.remove('open');
  document.getElementById('bookingOverlay')?.classList.remove('open');
}

function openBookingPanel() {
  document.getElementById('bookingPanel')?.classList.add('open');
  document.getElementById('bookingOverlay')?.classList.add('open');
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();

  // Open panel from side-tab
  document.getElementById('bookSideTab')?.querySelector('button')?.addEventListener('click', openBookingPanel);

  // Close on overlay click
  document.getElementById('bookingOverlay')?.addEventListener('click', closeBookingPanel);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBookingPanel();
  });
});
