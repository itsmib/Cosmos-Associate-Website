const items = [
  "40 Years of Trust",
  "200+ Plots Sold",
  "Karaikal's Most Trusted Builder",
  "BNI India Member",
  "Now Accepting Enquiries",
];

const Ticker = () => {
  const row = (
    <div className="flex shrink-0 items-center gap-12 px-6">
      {items.map((t, i) => (
        <div key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className="text-white/90 text-sm sm:text-base tracking-wide font-medium">
            ✦ {t}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-crimson py-3">
      <div className="flex animate-marquee w-max">
        {row}
        {row}
      </div>
    </div>
  );
};

export default Ticker;
