// src/utils/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ENV 확인
console.log('[supabase] 초기화 시작', { 
  url: url || '❌ URL 없음', 
  anonKeyExists: !!anon 
});

// 환경 변수 검증
if (!url || !anon) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다!');
  console.error('필요한 환경 변수:', {
    VITE_SUPABASE_URL: url || '❌ 없음',
    VITE_SUPABASE_ANON_KEY: anon ? '✓ 존재' : '❌ 없음'
  });
}

// 전역 싱글톤 타입 선언
declare global {
  interface Window {
    __SUPABASE_CLIENT__?: SupabaseClient;
  }
}

// Supabase 클라이언트 생성
function getSupabaseClient(): SupabaseClient | null {
  // 환경 변수가 없으면 null 반환
  if (!url || !anon) {
    console.error('❌ Supabase 클라이언트를 생성할 수 없습니다: 환경 변수 누락');
    return null;
  }

  // 브라우저 환경
  if (typeof window !== 'undefined') {
    if (window.__SUPABASE_CLIENT__) {
      console.warn('[supabase] 이미 초기화된 인스턴스 재사용');
      return window.__SUPABASE_CLIENT__;
    }

    try {
      const client = createClient(url, anon, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'X-Client-Info': 'supabase-js-web'
          }
        }
      });

      window.__SUPABASE_CLIENT__ = client;
      console.log('✅ [supabase] 클라이언트 생성 완료');
      return client;
    } catch (error) {
      console.error('❌ [supabase] 클라이언트 생성 실패:', error);
      return null;
    }
  }

  // SSR 환경 (Node.js)
  try {
    return createClient(url, anon, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-node'
        }
      }
    });
  } catch (error) {
    console.error('❌ [supabase] SSR 클라이언트 생성 실패:', error);
    return null;
  }
}

// 클라이언트 export
export const supabaseClient = getSupabaseClient();