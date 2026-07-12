import glob

html_files = glob.glob('c:/Projects/ct-studio-nz/*.html')

old = "onclick=\"document.getElementById('bookingPanel').classList.add('open')\""
new = "onclick=\"openBookingPanel()\""

for path in html_files:
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if old in c:
        c = c.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"Fixed: {path.split(chr(92))[-1]}")

print("Done.")
