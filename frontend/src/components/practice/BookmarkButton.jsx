import React from 'react';
export function BookmarkButton({ active, onClick }) { return <button className={active ? 'bookmark active' : 'bookmark'} onClick={onClick} aria-label={active ? 'Remove bookmark' : 'Bookmark problem'}>{active ? '★' : '☆'}</button>; }
