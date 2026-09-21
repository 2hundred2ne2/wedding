import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { realtimeDb } from '../../firebase.ts';

export interface Comment {
  id: string;
  sender: string;
  message: string;
  createdAt: number;
  date: string;
  passwordHash: string;
}

// guestbook 데이터가 바뀔 때마다 실시간으로 목록을 갱신합니다. (최신 글이 먼저)
export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!realtimeDb) return;

    const unsubscribe = onValue(ref(realtimeDb, 'guestbook'), (snapshot) => {
      const value = snapshot.val() as Record<
        string,
        Omit<Comment, 'id'>
      > | null;

      if (!value) {
        setComments([]);
        return;
      }

      const list = Object.entries(value)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

      setComments(list);
    });

    return () => unsubscribe();
  }, []);

  return comments;
};
