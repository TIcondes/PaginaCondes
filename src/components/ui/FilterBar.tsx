interface FilterOption {
  label: string
  value: string
}

interface Props {
  options: FilterOption[]
  active: string
  onChange: (value: string) => void
}

export default function FilterBar({ options, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-b border-gray-100">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`pb-3 text-sm font-body font-medium tracking-wide transition-colors relative ${
            active === opt.value ? 'text-brand-700' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {opt.label}
          {active === opt.value && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-600" />}
        </button>
      ))}
    </div>
  )
}
