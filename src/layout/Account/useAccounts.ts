import { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { realtimeDb } from '../../firebase.ts';
import { IHostInfo } from '@/types/data.ts';

type Status = 'loading' | 'ready' | 'error';

// 계좌 정보는 git에 올리지 않고 Firebase Realtime Database의 `accounts` 경로에서 읽어옵니다.
// Firebase는 배열을 {"0": ..., "1": ...} 형태로 돌려줄 수 있어 Object.values로 정리합니다.
export const useAccounts = () => {
  const [hosts, setHosts] = useState<IHostInfo[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!realtimeDb) {
      setStatus('error');
      return;
    }

    get(ref(realtimeDb, 'accounts'))
      .then((snapshot) => {
        const value = snapshot.val() as Record<string, IHostInfo> | null;
        const list = value
          ? Object.values(value).map((host) => ({
              ...host,
              accountInfo: Object.values(host.accountInfo ?? {}),
            }))
          : [];
        setHosts(list);
        setStatus(list.length > 0 ? 'ready' : 'error');
      })
      .catch(() => setStatus('error'));
  }, []);

  return { hosts, status };
};
