import { useEffect, useState } from 'react';
import './RotatingText.css';

interface Props {
  texts: string[];
  interval?: number;
  className?: string;
}

export default function RotatingText({ texts, interval = 2000, className = '' }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % texts.length), interval);
    return () => clearInterval(id);
  }, [texts, interval]);

  if (!texts || texts.length === 0) return null;

  return <span className={`text-rotate ${className}`}>{texts[index]}</span>;
}