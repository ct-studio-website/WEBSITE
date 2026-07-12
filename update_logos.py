import glob
import re

html_files = glob.glob('c:/Projects/ct-studio-nz/*.html')
logo_img = '<img src="https://res.cloudinary.com/dibcmlyg0/image/upload/q_auto/f_auto/v1779698741/logo_yxofkd.png" alt="CT Studio NZ Logo">'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace footer logo text with logo img
    content = re.sub(
        r'<div class="footer__logo">\s*CT STUDIO NZ\s*</div>',
        f'<div class="footer__logo">{logo_img}</div>',
        content
    )
    
    # Replace header text and onerror img
    content = re.sub(
        r'<img src="[^"]*" alt="CT Studio NZ Logo"[^>]*>\s*<span class="header__logo-text">CT STUDIO NZ</span>',
        logo_img,
        content
    )
    
    # Remove TikTok link blocks
    content = re.sub(
        r'\s*<a href="[^"]*" target="_blank" rel="noopener noreferrer" aria-label="TikTok">.*?</a>\s*',
        '\n',
        content,
        flags=re.DOTALL
    )
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML files updated.")
