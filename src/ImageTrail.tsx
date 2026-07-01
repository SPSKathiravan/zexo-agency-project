import { useEffect, useRef, useState } from "react";

type InfiniteMenuItem =
  | string
  | {
      image: string;
      link?: string;
      title?: string;
      description?: string;
    };

interface InfiniteMenuProps {
  items: InfiniteMenuItem[];
  scale?: number;
  variant?: number;
}

export default function InfiniteMenu(props: InfiniteMenuProps) {
  const { items, scale = 1 } = props;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let animId: number;
    let pos = 0;
    const speed = 0.6;

    const step = () => {
      if (!isPaused) {
        pos -= speed;
        const halfWidth = scroller.scrollWidth / 2;
        if (Math.abs(pos) >= halfWidth) {
          pos += halfWidth;
        }
        scroller.style.transform = `translateX(${pos}px)`;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, items]);

  if (!items || items.length === 0) return null;

  const renderItems = (list: InfiniteMenuItem[]) =>
    list.map((item, i) => {
      const image = typeof item === "string" ? item : item.image;
      const link = typeof item === "string" ? "#" : item.link ?? "#";
      const title = typeof item === "string" ? "" : item.title ?? "";
      const description = typeof item === "string" ? "" : item.description ?? "";

      return (
        <a
          key={i}
          href={link}
          className="inf-item"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ transform: `scale(${scale})` }}
        >
          <div className="inf-item-img-wrap">
            <img
              src={image}
              alt={title || `Image item ${i + 1}`}
              className="inf-item-img"
              draggable={false}
            />
            <div className="inf-item-overlay" />
          </div>
          {(title || description) && (
            <div className="inf-item-info">
              {title ? <span className="inf-item-title">{title}</span> : null}
              {description ? <span className="inf-item-desc">{description}</span> : null}
            </div>
          )}
        </a>
      );
    });

  return (
    <>
      <style>{`
        .inf-scroller-outer {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        .inf-scroller {
          display: flex;
          gap: 20px;
          align-items: center;
          height: 100%;
          will-change: transform;
          width: max-content;
        }
        .inf-item {
          flex-shrink: 0;
          width: 220px;
          height: 220px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          background: #111;
          border: 1px solid #1e1e1e;
          transition: border-color 0.3s, box-shadow 0.3s;
          transform-origin: center center;
        }
        .inf-item:hover {
          border-color: #0c8665;
          box-shadow: 0 0 30px rgba(12, 134, 101, 0.12);
        }
        .inf-item-img-wrap {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
        }
        .inf-item-img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          transition: transform 0.5s ease;
        }
        .inf-item:hover .inf-item-img {
          transform: scale(1.08);
        }
        .inf-item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(17,17,17,0.7) 0%, transparent 50%);
          pointer-events: none;
        }
        .inf-item-info {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }
        .inf-item-title {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.3;
        }
        .inf-item-desc {
          font-size: 11px;
          color: #0c8665;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
      <div className="inf-scroller-outer">
        <div className="inf-scroller" ref={scrollerRef}>
          {renderItems(items)}
          {renderItems(items)}
        </div>
      </div>
    </>
  );
}


