// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL!;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// 값 빠짐 확인용
if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.error('[supabase] Missing env', { url, hasAnon: !!anon });
}

/**
 * v2 경로(global.headers)와 v1 경로(headers)를 동시에 채워
 * "reading 'headers'" 오류를 원천 차단.
 */
export const supabaseClient = createClient(url, anon, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // v2가 참조
  global: { headers: {} },
  // v1이 참조(무시돼도 무해)
  headers: {},
} as any);

// 디버그(배포 콘솔에서도 1회 보임)
console.log('[supabase] client ready', { url, anonLoaded: !!anon });
