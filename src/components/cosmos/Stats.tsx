import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 40, suffix: "+", label: "Years of Excellence" },
  { value: 200, suffix: "+", label: "Plots Sold" },
  { value: 2, suffix: "", label: "Cities" },
  { value: 1000, suffix: "+", label: "Happy Families" },
];

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return n;
}

const Stat = ({ value, suffix, label, start }: typeof stats[0] & { start: boolean }) => {
  const n = useCountUp(value, start);
  return (
    <div className="flex-1 text-center px-6 py-8">
      <div className="font-serif text-5xl sm:text-6xl font-bold text-white mb-2">
        {n}
        {suffix}
      </div>
      <div className="text-white/70 text-sm tracking-[0.2em] uppercase">{label}</div>
    </div>
  );
};

const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStart(true)),
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="gradient-navy">
      <div className="container">
        <div className="flex flex-col md:flex-row md:divide-x divide-crimson/40 py-4">
          {stats.map((s, i) => (
            <Stat key={i} {...s} start={start} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
