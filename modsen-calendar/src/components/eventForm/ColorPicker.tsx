import { EVENT_COLOR_TOKENS } from '@/common/constants';
import styles from '@/components/eventForm/styles/event-form.module.scss';

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ColorPicker = ({ value, onChange, disabled = false }: Props) => (
  <div className={styles.colors}>
    {EVENT_COLOR_TOKENS.map(({ stroke, fill }) => (
      <button
        key={stroke}
        type="button"
        aria-label={stroke}
        disabled={disabled}
        className={styles.color}
        style={{
          borderColor: stroke,
          background: value === stroke ? fill : '#fff'
        }}
        onClick={() => onChange(stroke)}
      />
    ))}
  </div>
);
