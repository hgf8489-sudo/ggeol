const PERIODS = [
  { value: '1w', label: '1주' },
  { value: '1m', label: '1개월' },
  { value: '3m', label: '3개월' },
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
];

export default function PeriodSelector({ selected, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PERIODS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
            selected === value
              ? 'bg-accent-green text-black'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
