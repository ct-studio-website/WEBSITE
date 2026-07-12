import glob
import re

html_files = glob.glob('c:/Projects/ct-studio-nz/*.html')

calendly_assets = """    <!-- Calendly Widget Assets -->
    <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
    <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
</head>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add Calendly assets to head (if not already there)
    if 'assets.calendly.com' not in content:
        content = content.replace('</head>', calendly_assets)
        
    # 2. Replace the sticky Book Your Session button
    old_btn = '<a href="contact.html" class="sticky-book-btn">Book Your Session!</a>'
    new_btn = '<a href="#" class="sticky-book-btn" onclick="Calendly.initPopupWidget({url: \'https://calendly.com/ctstudionz89\'});return false;">Check Availability</a>'
    content = content.replace(old_btn, new_btn)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Calendar integration applied.")
