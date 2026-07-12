css = """
/* ===== Sticky Buttons ===== */
.sticky-book-btn {
  position: fixed;
  top: 120px;
  right: 20px;
  background-color: #c8a96e;
  color: #fff;
  padding: 12px 24px;
  border-radius: 50px;
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  z-index: 999;
  box-shadow: 0 4px 15px rgba(200, 169, 110, 0.4);
  transition: all 0.3s ease;
}
.sticky-book-btn:hover {
  background-color: #b3955d;
  transform: translateY(-2px);
  color: #fff;
}

.sticky-whatsapp-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25D366;
  color: #fff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
}
.sticky-whatsapp-btn svg {
  width: 35px;
  height: 35px;
}
.sticky-whatsapp-btn:hover {
  transform: scale(1.1);
  background-color: #1ebe57;
  color: #fff;
}

@media (max-width: 768px) {
  .sticky-book-btn {
    top: 90px;
    right: 15px;
    padding: 10px 16px;
    font-size: 0.75rem;
  }
  .sticky-whatsapp-btn {
    bottom: 15px;
    right: 15px;
    width: 50px;
    height: 50px;
  }
  .sticky-whatsapp-btn svg {
    width: 30px;
    height: 30px;
  }
}
"""

with open('c:/Projects/ct-studio-nz/css/style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print("CSS appended.")
