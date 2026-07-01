import { useState } from 'react';
import './Stack.css';

interface StackProps {
  cards?: React.ReactNode[];
  // Legacy props from the old animated version are accepted (and ignored)
  // so existing call sites don't need to change.
  [key: string]: unknown;
}

export default function Stack({ cards = [] }: StackProps) {
  const [open, setOpen] = useState(false);

  if (!cards.length) return null;

  const previewCard = cards[0];
  const extraCount = cards.length - 1;

  return (
    <>
      <div
        className="stack-container"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="View all photos"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen(true);
        }}
      >
        <div className="stack-preview">{previewCard}</div>
        {extraCount > 0 && <div className="stack-count-badge">+{extraCount}</div>}
      </div>

      {open && (
        <div
          className="stack-modal-backdrop"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="stack-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="stack-modal-close"
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
            >
              ✕
            </button>
            <div className="stack-modal-grid">
              {cards.map((card, i) => (
                <div className="stack-modal-item" key={i}>
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