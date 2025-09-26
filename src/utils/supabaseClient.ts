import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ✅ Vite 환경변수만 사용 (하드코딩 금지)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 값이 빠졌을 때 원인 파악을 돕기 위한 경고 로그(배포/개발 공통)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // 여기서 throw 하면 빌드/런타임이 바로 죽으니, 우선 경고만 남깁니다.
  // 필요하면 throw new Error(...) 로 바꿔도 됩니다.
  // eslint-disable-next-line no-console
  console.error(
    '[supabaseClient] Missing env: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY'
  );
}

// -------------------------------------------------------------
// 안전한 Supabase 클라이언트 생성 (SPA 기준: null 반환 없음)
//  - SSR을 안 쓰는 Vite SPA라면 window 가드/NULL 반환은 불필요
// -------------------------------------------------------------
export function createSafeSupabaseClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

// -------------------------------------------------------------
// 단일 인스턴스 생성 (공개 API는 이것만 사용)
// - 다른 파일들: import { supabaseClient } from "@/utils/supabaseClient"
// -------------------------------------------------------------
export const supabaseClient = createSafeSupabaseClient();