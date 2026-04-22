import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import styles from './styles/SettingsModal.module.scss';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}

export const SettingsModal = ({ open, onClose, onLogout, userName, userEmail }: SettingsModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Account</h3>
            <div className={styles.info}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Name:</span>
                <span className={styles.value}>{userName || 'Rosalie'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{userEmail || 'rosalie.rice@gmail.com'}</span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Actions</h3>
            <Button
              variant="secondary"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
