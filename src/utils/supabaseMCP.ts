// src/utils/supabaseMCP.ts
import { supabaseClient } from './supabaseClient';
import { 
  SupabaseConnectionStatus, 
  SupabaseSchemaInfo, 
  SupabaseTestData, 
  SupabaseQueryResult,
  Customer,
  Appointment,
  Product,
  FinanceRecord
} from '../types';

export class SupabaseMCP {
  private supabase = supabaseClient;
  private isConnected = false;

  constructor() {
    // 추가 초기화 불필요 (공용 인스턴스만 사용)
  }

  // ↓↓↓ 이하 기존 메서드들( getSchemaInfo / getTestData / getCustomers 등)은
  //     그대로 두고 this.supabase 만 쓰면 됩니다.
}

// 싱글톤 인스턴스 유지
export const supabaseMCP = new SupabaseMCP();
