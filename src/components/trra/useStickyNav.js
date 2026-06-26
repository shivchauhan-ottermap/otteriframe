import { useEffect, useState } from "react";

export default function useStickyNav(heroSelector = ".trra-hero") {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(heroSelector);
    if (!hero) return;

    const heroHeight = hero.offsetHeight;

    const onScroll = () => {
      setVisible(window.scrollY > heroHeight * 0.6);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [heroSelector]);

  return visible;
}
