import { useEffect, useState, type RefObject } from 'react';
import { ArrowUp } from 'lucide-react';

type BackToTopButtonProps = {
  threshold?: number;
  containerRef?: RefObject<HTMLElement | null>;
};

export function BackToTopButton({ threshold = 320, containerRef }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = containerRef?.current;

    const getScrollTop = () => (target ? target.scrollTop : window.scrollY);
    const handleScroll = () => setVisible(getScrollTop() > threshold);

    handleScroll();

    if (target) {
      target.addEventListener('scroll', handleScroll, { passive: true });
      return () => target.removeEventListener('scroll', handleScroll);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef, threshold]);

  const handleClick = () => {
    const target = containerRef?.current;

    if (target) {
      target.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all hover:bg-gray-800"
    >
      <ArrowUp size={16} />
      Voltar ao topo
    </button>
  );
}
