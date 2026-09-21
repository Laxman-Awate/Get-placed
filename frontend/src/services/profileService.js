<<<<<<< Updated upstream
import { apiRequest } from './apiClient'; export const profileService={getProfile:async()=>apiRequest('/profile'),updateProfile:async profile=>apiRequest('/profile',{method:'PUT',body:JSON.stringify(profile)})};
=======
import { authService } from './authService';
import { cached, invalidate, peek, TTL } from '../utils/cache';

const KEY = 'profile';

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function normalize(profile) {
  if (!profile) return null;
  return {
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    college: profile.college || '',
    degree: profile.degree || '',
    branch: profile.branch || '',
    graduationYear: profile.graduationYear || '',
    semester: profile.semester || '',
    cgpa: profile.cgpa || '',
    role: profile.role || '',
    locations: profile.locations || '',
    companies: toArray(profile.companies),
    skills: toArray(profile.skills),
  };
}

async function fetchProfile() {
  const res = await authService.authFetch('/profile');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to load profile (${res.status})`);
  }
  return normalize(await res.json());
}

export const profileService = {
  peekProfile: () => peek(KEY),
  getProfile: () => cached(KEY, TTL.PROFILE, fetchProfile),
  updateProfile: async (profile) => {
    const res = await authService.authFetch('/profile', {
      method: 'PUT',
      body: JSON.stringify({
        ...profile,
        companies: toArray(profile.companies),
        skills: toArray(profile.skills),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `Failed to save profile (${res.status})`);
    }
    const data = normalize(await res.json());
    invalidate(KEY); // next read fetches fresh; current result returned directly
    // Prime cache so back-navigation is instant.
    return cached(KEY, TTL.PROFILE, async () => data);
  },
};
>>>>>>> Stashed changes
