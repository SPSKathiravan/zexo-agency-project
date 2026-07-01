import { useState, useEffect, type CSSProperties } from 'react';
import './Stack.css';

interface StackProps {
  cards?: React.ReactNode[];
  // Legacy props from the old animated version are accepted (and ignored)
  // so existing call sites don't need to change.
  [key: string]: unknown;
}

// Critical layout is inlined (not left to an external stylesheet) so the
// grid/gallery always renders correctly even if Stack.css fails to load
// or a stale/cached copy is served — this was causing the mobile gallery
// to fall back to a plain single-column list of full-size images.

const containerStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
  overflow: 'hidden',
  background: '#0a0a0a',
  touchAction: 'manipulation',
};

const previewWrapStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const seeAllBtnStyle: CSSProperties = {
  position: 'absolute',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  background: 'rgba(12, 134, 101, 0.95)',
  color: '#fff',
  border: 'none',
  fontSize: '12px',
  fontWeight: 700,
  padding: '8px 16px',
  borderRadius: '999px',
  cursor: 'pointer',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: '#050505',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  touchAction: 'manipulation',
  overscrollBehavior: 'contain',
};

const modalStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '1000px',
  maxHeight: '92vh',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  background: '#111111',
  borderRadius: '14px',
  padding: '12px',
  WebkitOverflowScrolling: 'touch',
};

const closeBtnStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  float: 'right',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(0, 0, 0, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  zIndex: 2,
  marginBottom: '8px',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
};

// Grid auto-fits its columns to whatever width is available — this alone
// adapts from phones to desktop without needing separate breakpoints.
const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
  gap: '6px',
  clear: 'both',
};

const gridItemStyle: CSSProperties = {
  aspectRatio: '1 / 1',
  borderRadius: '8px',
  overflow: 'hidden',
  background: '#0a0a0a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function Stack({ cards = [] }: StackProps) {
  const [open, setOpen] = useState(false);

  // Lock the background page while the gallery is open. Without this,
  // the page behind can still scroll, which makes the navbar's blur
  // effect flicker on/off, and causes janky/laggy touch behavior.
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = prevOverflow;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!cards.length) return null;

  const previewCard = cards[0];

  return (
    <>
      <div className="stack-container" style={containerStyle}>
        <div className="stack-preview" style={previewWrapStyle}>
          {previewCard}
        </div>
        <button
          type="button"
          className="stack-see-all-btn"
          style={seeAllBtnStyle}
          onClick={() => setOpen(true)}
        >
          See All <span style={{ opacity: 0.85, fontWeight: 600 }}>({cards.length})</span>
        </button>
      </div>

      {open && (
        <div
          className="stack-modal-backdrop"
          style={backdropStyle}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="stack-modal" style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="stack-modal-close"
              style={closeBtnStyle}
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
            >
              ✕
            </button>
            <div className="stack-modal-grid" style={gridStyle}>
              {cards.map((card, i) => (
                <div className="stack-modal-item" style={gridItemStyle} key={i}>
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}