import glob
import re

LOGO_IMG = '<img src="https://res.cloudinary.com/dibcmlyg0/image/upload/q_auto/f_auto/v1779698741/logo_yxofkd.png" alt="CT Studio NZ Logo" style="max-height:60px;width:auto;">'

FOOTER_LOGO_WITH_IMG = f'<div class="footer__logo">{LOGO_IMG}</div>'

# Shared sticky HTML (replaces everything between <!-- Sticky Buttons --> and </body>)
STICKY_HTML = '''    <!-- Sticky Buttons -->
    <!-- Side-tab Book Your Session -->
    <div class="sticky-side-tab" id="bookSideTab">
        <button class="sticky-side-tab__btn" onclick="document.getElementById('bookingPanel').classList.add('open')" aria-label="Book Your Session">
            Book Your Session!
        </button>
    </div>

    <!-- Booking Panel Overlay -->
    <div class="booking-panel-overlay" id="bookingOverlay" onclick="closeBookingPanel()"></div>
    <div class="booking-panel" id="bookingPanel">
        <button class="booking-panel__close" onclick="closeBookingPanel()" aria-label="Close">&times;</button>
        <div id="calendarRoot"></div>
    </div>

    <!-- WhatsApp sticky button -->
    <a href="https://wa.me/64224663080" class="sticky-whatsapp-btn" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.031 0C5.385 0 0 5.388 0 12.035c0 2.128.552 4.195 1.6 6.02L.036 24l6.108-1.597c1.758.946 3.738 1.445 5.882 1.445 6.645 0 12.032-5.389 12.032-12.035S18.676 0 12.031 0zm-1.01 22.046c-1.782 0-3.528-.479-5.06-1.385l-.36-.214-3.766.985.998-3.67-.235-.373a9.99 9.99 0 0 1-1.528-5.353c0-5.518 4.49-10.01 10.01-10.01 2.673 0 5.183 1.042 7.073 2.934 1.89 1.89 2.932 4.399 2.932 7.076 0 5.519-4.49 10.01-10.01 10.01zm5.496-7.512c-.302-.15-1.787-.882-2.064-.984-.277-.101-.479-.151-.68.151s-.781.984-.957 1.185c-.176.202-.353.227-.655.076a8.17 8.17 0 0 1-2.4-1.482 9.07 9.07 0 0 1-1.658-2.068c-.176-.303-.018-.466.133-.617.136-.136.302-.353.453-.529.151-.176.202-.302.302-.504.101-.201.05-.378-.025-.529-.076-.151-.68-1.637-.932-2.241-.246-.593-.497-.512-.68-.521h-.579c-.202 0-.529.076-.806.378-.277.303-1.058 1.034-1.058 2.52 0 1.486 1.083 2.922 1.234 3.123.151.202 2.13 3.251 5.16 4.56.721.311 1.282.497 1.721.636.723.23 1.382.197 1.899.119.58-.088 1.787-.73 2.039-1.436.252-.705.252-1.31.176-1.436-.075-.126-.277-.201-.579-.352z"/></svg>
    </a>

    <script src="js/main.js"></script>
    <script src="js/calendar.js"></script>
'''

# Calendly junk to remove from <head>
CALENDLY_PATTERN = re.compile(
    r'\s*<!-- Calendly Widget Assets -->.*?</script>\s*',
    re.DOTALL
)
CALENDLY_BADGE_PATTERN = re.compile(
    r'<script type="text/javascript">window\.onload.*?</script>',
    re.DOTALL
)

html_files = glob.glob('c:/Projects/ct-studio-nz/*.html')

for path in html_files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove Calendly from head
    content = CALENDLY_PATTERN.sub('', content)
    content = CALENDLY_BADGE_PATTERN.sub('', content)

    # 2. Fix footer logo (any variation)
    content = re.sub(
        r'<div class="footer__logo">.*?</div>',
        FOOTER_LOGO_WITH_IMG,
        content,
        flags=re.DOTALL
    )

    # 3. Remove the old sticky section (everything from <!-- Sticky Buttons --> to </body>)
    content = re.sub(
        r'\s*<!-- Sticky Buttons -->.*?</body>',
        '\n' + STICKY_HTML + '\n</body>',
        content,
        flags=re.DOTALL
    )

    # 4. Remove duplicate <script src="js/main.js"> that may now be orphaned before our new section
    # (our STICKY_HTML already includes it once at the end)
    # Remove any standalone <script src="js/main.js"></script> that appear BEFORE the sticky block
    # We'll do a careful replacement: keep only the one inside STICKY_HTML
    # First count occurrences
    count = content.count('<script src="js/main.js"></script>')
    if count > 1:
        # Remove the first occurrence (the old one)
        content = content.replace('<script src="js/main.js"></script>', '', 1)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated: {path}")

print("Done.")
