// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {

    // ===== Header Scroll Effect =====
    const header = document.querySelector('.header');

    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Check on load

    // ===== Mobile Menu =====
    const hamburger = document.querySelector('.header__hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a');

        function toggleMobileMenu() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
        }

        hamburger.addEventListener('click', toggleMobileMenu);

        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });

        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                toggleMobileMenu();
            });
        });
    }

    // ===== Fade In Animation =====
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function(el) {
            fadeObserver.observe(el);
        });
    }

    // ===== Photo Filter =====
    const photoFilterBtns = document.querySelectorAll('.photo-section .filter-btn');
    const photoItems = document.querySelectorAll('.photo-grid .photo-grid__item');

    if (photoFilterBtns.length > 0) {
        photoFilterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;

                photoFilterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                photoItems.forEach(function(item) {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                        // Force-load images that haven't loaded yet (lazy images off-screen)
                        var img = item.querySelector('img');
                        if (img && (!img.complete || img.naturalWidth === 0)) {
                            img.setAttribute('loading', 'eager');
                            var s = img.src; img.src = ''; img.src = s;
                        }
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ===== Video Filter =====
    const videoFilterBtns = document.querySelectorAll('.video-section .filter-btn');
    const videoItems = document.querySelectorAll('.video-grid .video-grid__item');

    if (videoFilterBtns.length > 0) {
        videoFilterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;

                videoFilterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                videoItems.forEach(function(item) {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ===== Photo Lightbox =====
    const lightbox = document.getElementById('lightbox');

    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox__image');
        const lightboxClose = lightbox.querySelector('.lightbox__close');
        let lightboxToken = 0; // prevents stale onload from overwriting a newer click

        photoItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    const token = ++lightboxToken;
                    // Show thumbnail immediately so lightbox isn't blank while full-res loads
                    lightboxImage.src = img.src;
                    lightboxImage.alt = img.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';

                    // Swap to full-res once loaded — token check prevents race condition
                    if (img.dataset.full) {
                        const fullImg = new Image();
                        fullImg.onload = function() {
                            if (lightboxToken === token) {
                                lightboxImage.src = img.dataset.full;
                            }
                        };
                        fullImg.src = img.dataset.full;
                    }
                }
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImage.src = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ===== Video Modal =====
    const videoModal = document.getElementById('videoModal');

    if (videoModal) {
        const videoModalContent = document.getElementById('videoModalContent');
        const videoModalClose = videoModal.querySelector('.video-modal__close');

        videoItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const videoSrc = this.dataset.video;
                if (videoSrc) {
                    videoModalContent.innerHTML = '<video controls autoplay><source src="' + videoSrc + '" type="video/mp4">Your browser does not support the video tag.</video>';
                } else {
                    videoModalContent.innerHTML = '<p class="video-modal__message">Video coming soon</p>';
                }
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeVideoModal() {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            videoModalContent.innerHTML = '';
        }

        videoModalClose.addEventListener('click', closeVideoModal);

        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }

    // ===== FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Close all items
                faqItems.forEach(function(i) {
                    i.classList.remove('active');
                    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });

            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // ===== Contact Form =====
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    if (contactForm && toast) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Show toast
            toast.classList.add('active');

            // Reset form
            contactForm.reset();

            // Hide toast after 4 seconds
            setTimeout(function() {
                toast.classList.remove('active');
            }, 4000);
        });
    }

    // ===== Image Error Handling =====
    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('error', function() {
            // Skip if already processed or is logo with text fallback
            if (this.dataset.errorHandled || this.closest('.header__logo, .hero__logo')) {
                return;
            }

            this.dataset.errorHandled = 'true';

            // Get filename from src
            const src = this.src;
            const filename = src.split('/').pop().split('?')[0];

            // Create fallback div
            const fallback = document.createElement('div');
            fallback.className = 'photo-fallback';
            fallback.textContent = decodeURIComponent(filename);

            // Replace image with fallback
            if (this.parentNode) {
                this.parentNode.replaceChild(fallback, this);
            }
        });
    });
});
