import glob
import re

# 1. FIX VIDEO.HTML
with open('c:/Projects/ct-studio-nz/video.html', 'r', encoding='utf-8') as f:
    video_content = f.read()

new_video_grid = """<div class="video-grid fade-in">
                    <!-- Business Videos -->
                    <div class="video-grid__item" data-category="business" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782727634/Anne_Reel_1_tvnnod.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782727634/Anne_Reel_1_tvnnod.jpg" alt="Business video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>
                    <div class="video-grid__item" data-category="business" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782726313/Arti_Reel_1_hi9lnm.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782726313/Arti_Reel_1_hi9lnm.jpg" alt="Business video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>
                    <div class="video-grid__item" data-category="business" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782726122/ranjan_Reel_1_xr2ims.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782726122/ranjan_Reel_1_xr2ims.jpg" alt="Business video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>

                    <!-- Events Videos -->
                    <div class="video-grid__item" data-category="events" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782725692/pada_padma_Reel_1_r6ok9a.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782725692/pada_padma_Reel_1_r6ok9a.jpg" alt="Events video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>
                    <div class="video-grid__item" data-category="events" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782725414/canterlanka_Reel_1_yuewso.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782725414/canterlanka_Reel_1_yuewso.jpg" alt="Events video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>
                    <div class="video-grid__item" data-category="events" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782723463/Ciara_and_Matt_1_y7gi52.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782723463/Ciara_and_Matt_1_y7gi52.jpg" alt="Events video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>
                    <div class="video-grid__item" data-category="events" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782613760/WORLD_DRUMMING_FESTIVAL_2026_ek8p1n.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782613760/WORLD_DRUMMING_FESTIVAL_2026_ek8p1n.jpg" alt="Events video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>

                    <!-- Outdoor Videos -->
                    <div class="video-grid__item" data-category="outdoor" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782724730/indiana_Reel_1_u1t2g2.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782724730/indiana_Reel_1_u1t2g2.jpg" alt="Outdoor video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>
                    <div class="video-grid__item" data-category="outdoor" data-video="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782724289/Anne_Reel_y28nvx.mp4">
                        <img src="https://res.cloudinary.com/dibcmlyg0/video/upload/v1782724289/Anne_Reel_y28nvx.jpg" alt="Outdoor video" loading="lazy">
                        <div class="video-grid__play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg></div>
                    </div>
                </div>"""

# Replace everything from <div class="video-grid fade-in"> to its matching closing tag
import re
video_content = re.sub(r'<div class="video-grid fade-in">.*?</div>\s*<!-- CTA Section -->', new_video_grid + '\n                <!-- CTA Section -->', video_content, flags=re.DOTALL)
with open('c:/Projects/ct-studio-nz/video.html', 'w', encoding='utf-8') as f:
    f.write(video_content)

# 2. FIX BUTTONS ACROSS ALL HTML FILES
html_files = glob.glob('c:/Projects/ct-studio-nz/*.html')

calendly_script = """<script type="text/javascript">window.onload = function() { Calendly.initBadgeWidget({ url: 'https://calendly.com/ctstudionz89', text: 'Check Availability', color: '#c8a96e', textColor: '#ffffff', branding: undefined }); }</script>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add Calendly badge script if not present
    if 'Calendly.initBadgeWidget' not in content:
        content = content.replace('</head>', f'{calendly_script}\n</head>')
        
    # Revert Check Availability button back to Book Your Session
    bad_btn = '<a href="#" class="sticky-book-btn" onclick="Calendly.initPopupWidget({url: \'https://calendly.com/ctstudionz89\'});return false;">Check Availability</a>'
    good_btn = '<a href="contact.html" class="sticky-book-btn">Book Your Session!</a>'
    
    if bad_btn in content:
        content = content.replace(bad_btn, good_btn)
    else:
        # Just in case it's slightly different
        content = re.sub(r'<a href="#" class="sticky-book-btn".*?Check Availability</a>', good_btn, content)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixes applied successfully.")
