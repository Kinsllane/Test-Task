import styles from '@/components/common/styles/button.module.scss';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export const Segmented = <T extends string,>({
  value,
  options,
  onChange
}: {
  value: T;
  options: Array<SegmentedOption<T>>;
  onChange: (value: T) => void;
}) => (
  <div className={styles.segmented} role="tablist">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        role="tab"
        aria-selected={opt.value === value}
        className={`${styles.segment} ${opt.value === value ? styles.segmentActive : ''}`}
        onClick={() => onChange(opt.value)}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

