import { useState, useEffect } from "react";

const footerStyles = `
  .zexo-footer {
    background: #050505;
    padding: 100px 60px 40px;
    border-top: 1px solid #1a1a1a;
    font-family: 'Inter', sans-serif;
    color: #fff;
    overflow: hidden;
  }

  .footer-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 60px;
  }

  .footer-col {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .footer-col.reveal {
    opacity: 1;
    transform: translateY(0);
  }

  .footer-logo {
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 25px;
    text-decoration: none;
    color: #fff;
  }

  .footer-desc {
    color: #9ca3af;
    line-height: 1.8;
    font-size: 15px;
    max-width: 300px;
  }

  .footer-title {
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 25px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #0c8665;
  }

  .footer-links {
    list-style: none;
    padding: 0;
  }

  .footer-links li {
    margin-bottom: 15px;
  }

  .footer-links a {
    color: #9ca3af;
    text-decoration: none;
    font-size: 15px;
    transition: all 0.3s ease;
    display: inline-block;
  }

  .footer-links a:hover {
    color: #0c8665;
    transform: translateX(8px);
  }

  .social-row {
    display: flex;
    gap: 15px;
    margin-top: 20px;
  }

  .social-icon {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid #222;
    font-size: 12px;
    font-weight: bold;
  }

  .social-icon:hover {
    background: #0c8665;
    transform: scale(1.15) translateY(-5px);
    box-shadow: 0 10px 20px rgba(12, 134, 101, 0.3);
  }

  .footer-bottom {
    max-width: 1200px;
    margin: 80px auto 0;
    padding-top: 30px;
    border-top: 1px solid #1a1a1a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #4b5563;
    font-size: 14px;
  }

  .back-to-top {
    background: #111;
    border: 1px solid #222;
    color: #fff;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .back-to-top:hover {
    background: #0c8665;
    border-color: #0c8665;
  }

  @media (max-width: 900px) {
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
    .zexo-footer { padding: 60px 24px 30px; }
    .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
  }
`;

export default function ZexoFooter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("footer-trigger");
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="zexo-footer" id="footer-trigger">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className={`footer-col ${isVisible ? "reveal" : ""}`} style={{ transitionDelay: "0.1s" }}>
            <a href="#" className="footer-logo">
              <span style={{ color: '#fff' }}>Zexo&nbsp;</span>
              <span style={{ color: '#0c8665' }}>Agency</span>
            </a>
            <p className="footer-desc">
              Your global digital growth partner. We bridge the gap between imagination and technical excellence.
            </p>
            <div className="social-row">
              <a href="#" className="social-icon">IG</a>
              <a href="#" className="social-icon">LI</a>
              <a href="#" className="social-icon">TW</a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className={`footer-col ${isVisible ? "reveal" : ""}`} style={{ transitionDelay: "0.2s" }}>
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li><a href="#">Web Design</a></li>
              <li><a href="#">Social Media</a></li>
              <li><a href="#">Logo Design</a></li>
              <li><a href="#">SEO Growth</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className={`footer-col ${isVisible ? "reveal" : ""}`} style={{ transitionDelay: "0.3s" }}>
            <h4 className="footer-title">Agency</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Projects</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className={`footer-col ${isVisible ? "reveal" : ""}`} style={{ transitionDelay: "0.4s" }}>
            <h4 className="footer-title">Start a Project</h4>
            <p className="footer-desc" style={{ marginBottom: '20px' }}>
              Ready to scale your digital presence?
            </p>
            <a href="mailto:info@zexoagency.com" style={{ 
              color: '#fff', 
              textDecoration: 'none', 
              fontSize: '18px', 
              fontWeight: '700',
              borderBottom: '2px solid #0c8665',
              paddingBottom: '5px'
            }}>
              info@zexoagency.com
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Zexo Agency. All rights reserved.</p>
          <button className="back-to-top" onClick={scrollToTop}>
            Back to Top ↑
          </button>
        </div>
      </footer>
    </>
  );
}