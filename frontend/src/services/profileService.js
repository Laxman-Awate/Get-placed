import { STUDENT_PROFILE } from '../constants/profile'; export const profileService={getProfile:async()=>({...STUDENT_PROFILE}),updateProfile:async profile=>profile};
