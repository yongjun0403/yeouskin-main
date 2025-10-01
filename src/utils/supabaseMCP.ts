// src/utils/supabaseMCP.ts
import { supabaseClient } from './supabaseClient';
import { 
  SupabaseConnectionStatus, 
  SupabaseSchemaInfo, 
  SupabaseTestData,
} from '../types';

export class SupabaseMCP {
  private supabase = supabaseClient;
  private isConnected = false;

  constructor() {}

  // 연결 테스트
  async testConnection(): Promise<SupabaseConnectionStatus> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('count')
        .limit(1);

      if (error) throw error;

      this.isConnected = true;
      return { 
        success: true, 
        message: '연결 성공',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.isConnected = false;
      return { 
        success: false, 
        message: `연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // …(기존 메서드들에서는 this.supabase만 사용)
  // 나머지 메서드 내부의 this.supabase 호출부는 그대로 유지
}

export const supabaseMCP = new SupabaseMCP();
