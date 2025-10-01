// src/utils/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 1) ENV 주입 확인 로그
console.log('[supabase] boot', { url, anonLoaded: !!anon });

// 전역 싱글톤 타입 선언 (브라우저 전용)
declare global {
  interface Window {
    __SUPABASE_CLIENT__?: SupabaseClient;
  }
}

// 공용 인스턴스 생성(중복 방지 + 추적)
function getSupabaseClient(): SupabaseClient {
  // 브라우저 환경
  if (typeof window !== 'undefined') {
    if (window.__SUPABASE_CLIENT__) {
      console.warn('[supabase] duplicate init detected — reusing existing instance');
      console.trace('[supabase] duplicate init stack');
      return window.__SUPABASE_CLIENT__;
    }

    const client = createClient(url, anon, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      // v2 경로
      global: { headers: {} },
      // v1 경로(무시돼도 무해) — 일부 환경에서 'headers' 읽기 오류 방지
      headers: {},
    } as any);

    window.__SUPABASE_CLIENT__ = client;
    console.log('[supabase] client ready');
    return client;
  }

  // SSR/Node(있다면) — 전역 보관 없이 즉시 생성
  return createClient(url, anon, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: { headers: {} },
    headers: {},
  } as any);
}

// ✅ 모듈 최상위에서 단 한 번 export
export const supabaseClient = getSupabaseClient();
