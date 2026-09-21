// Replace each empty driveUrl with the semester's Google Drive folder when ready.
export const ACADEMIC_RESOURCES = Object.fromEntries(
  Array.from({ length: 8 }, (_, index) => [`semester-${index + 1}`, { driveUrl: '' }]),
);
