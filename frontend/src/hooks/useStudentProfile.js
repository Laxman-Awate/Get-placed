import { useEffect, useMemo, useState } from 'react';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';

export function useStudentProfile() {
  const [profile, setProfile] = useState(() => profileService.peekProfile() || null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(() => !profileService.peekProfile());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    profileService
      .getProfile()
      .then((data) => {
        if (!active) return;
        const sessionUser = authService.getUser();
        if (sessionUser && (!data.name || !data.email)) {
          data = {
            ...data,
            name: data.name || sessionUser.name || '',
            email: data.email || sessionUser.email || '',
          };
        }
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        // Keep stale cached profile visible; only error when nothing to show.
        setProfile((cur) => cur);
        setError(err.message || 'Failed to load profile.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const completion = useMemo(() => {
    if (!profile) return 0;
    const fields = ['name', 'email', 'college', 'degree', 'branch', 'graduationYear', 'semester', 'cgpa', 'role', 'locations', 'skills'];
    return Math.round((fields.filter((f) => profile[f] && String(profile[f]).length).length / fields.length) * 100);
  }, [profile]);

  const update = (key, value) => setProfile((cur) => ({ ...cur, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const result = await profileService.updateProfile(profile);
      setProfile(result);
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return { profile, editing, setEditing, completion, update, save, saved, loading, saving, error };
}
