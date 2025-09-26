// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL!;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// 값 빠짐 디버그 로그
if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.error('[supabase] Missing env', { url, hasAnon: !!anon });
}

export const supabaseClient = createClient(url, anon);
