import { useState, FormEvent } from 'react';
import { useAppSelector, useAppDispatch } from '@/common/reduxHooks';
import { setUser } from '@/store/authSlice';
import { updateUserProfile } from '@/api/firebaseAuth';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { showToast } from '@/components/common/Toast';
import styles from './styles/ProfileModal.module.scss';

import avatar1 from '@/assets/avatars/avatar-1.svg';
import avatar2 from '@/assets/avatars/avatar-2.svg';
import avatar3 from '@/assets/avatars/avatar-3.svg';
import avatar4 from '@/assets/avatars/avatar-4.svg';
import avatar5 from '@/assets/avatars/avatar-5.svg';
import avatar6 from '@/assets/avatars/avatar-6.svg';
import avatar7 from '@/assets/avatars/avatar-7.svg';
import avatar8 from '@/assets/avatars/avatar-8.svg';

const AVATARS = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8];

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? avatar1);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      showToast('Please fill all fields');
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile({ firstName, lastName });

      dispatch(
        setUser({
          firstName,
          lastName,
          email: user?.email || '',
          photoURL
        })
      );

      showToast('Profile updated successfully');
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
      showToast('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.photoSection}>
          <div className={styles.avatarPreview}>
            <img src={photoURL} alt="Profile" className={styles.avatarImage} />
          </div>

          <div className={styles.avatarGrid}>
            {AVATARS.map((avatar, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.avatarOption} ${photoURL === avatar ? styles.selected : ''}`}
                onClick={() => setPhotoURL(avatar)}
              >
                <img src={avatar} alt={`Avatar ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <Input
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter first name"
          required
        />

        <Input
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter last name"
          required
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
