import { supabaseClient } from './supabaseClient';

// 🔍 Supabase 클라이언트 초기화 검증
if (!supabaseClient) {
  console.error('❌ Supabase 클라이언트가 null입니다!');
  console.error('환경 변수를 확인하세요:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ 존재함' : '✗ 없음'
  });
}

// 안전한 Supabase 클라이언트 내보내기
export const supabase = supabaseClient;

// 개발 모드에서 상세 로깅
if (import.meta.env.DEV) {
  console.log('🔧 Supabase 클라이언트 상태:', {
    초기화됨: !!supabase,
    URL: import.meta.env.VITE_SUPABASE_URL || '❌ 없음',
    ANON_KEY_존재: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    환경: import.meta.env.MODE
  });
}

// 타입 정의
export interface SupabaseCustomer {
  id: string;
  name: string;
  phone: string;
  birth_date?: string;
  skin_type?: 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
  memo?: string;
  point: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
  type: 'voucher' | 'single';
  count?: number;
  status: 'active' | 'inactive';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAppointment {
  id: string;
  customer_id: string;
  product_id: string;
  datetime: string;
  memo?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  created_at: string;
  updated_at: string;
}

export interface SupabaseFinance {
  id: string;
  date: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  memo?: string;
  created_at: string;
  updated_at: string;
}

// 🛡️ API 호출 전 체크 헬퍼 함수
const ensureSupabaseClient = () => {
  if (!supabase) {
    const error = new Error('❌ Supabase 클라이언트가 초기화되지 않았습니다. 환경 변수를 확인하세요.');
    console.error(error.message);
    console.error('현재 환경 변수:', {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '❌ 설정 안됨',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ 존재' : '❌ 설정 안됨'
    });
    throw error;
  }
};

// 🔍 에러 핸들링 헬퍼
const handleError = (error: any, operation: string) => {
  console.error(`❌ ${operation} 실패:`, error);
  throw error;
};

// 고객 관련 함수
export const customerApi = {
  // 모든 고객 조회
  async getAll() {
    ensureSupabaseClient();
    console.log('🔍 고객 목록 조회 중...');
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) handleError(error, '고객 목록 조회');
    console.log(`✅ 고객 ${data?.length || 0}명 조회 완료`);
    return data;
  },

  // 고객 추가
  async create(customer: Omit<SupabaseCustomer, 'id' | 'created_at' | 'updated_at'>) {
    ensureSupabaseClient();
    console.log('➕ 고객 추가 중:', customer.name);
    
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();
    
    if (error) handleError(error, '고객 추가');
    console.log('✅ 고객 추가 완료:', data?.name);
    return data;
  },

  // 고객 수정
  async update(id: string, customer: Partial<SupabaseCustomer>) {
    ensureSupabaseClient();
    console.log('✏️ 고객 수정 중:', id);
    
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error, '고객 수정');
    console.log('✅ 고객 수정 완료');
    return data;
  },

  // 고객 삭제
  async delete(id: string) {
    ensureSupabaseClient();
    console.log('🗑️ 고객 삭제 중:', id);
    
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) handleError(error, '고객 삭제');
    console.log('✅ 고객 삭제 완료');
  },

  // 고객 검색
  async search(query: string) {
    ensureSupabaseClient();
    console.log('🔍 고객 검색 중:', query);
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) handleError(error, '고객 검색');
    console.log(`✅ ${data?.length || 0}명 검색됨`);
    return data;
  }
};

// 상품 관련 함수
export const productApi = {
  async getAll() {
    ensureSupabaseClient();
    console.log('🔍 상품 목록 조회 중...');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) handleError(error, '상품 목록 조회');
    console.log(`✅ 상품 ${data?.length || 0}개 조회 완료`);
    return data;
  },

  async create(product: Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at'>) {
    ensureSupabaseClient();
    console.log('➕ 상품 추가 중:', product.name);
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) handleError(error, '상품 추가');
    console.log('✅ 상품 추가 완료');
    return data;
  },

  async update(id: string, product: Partial<SupabaseProduct>) {
    ensureSupabaseClient();
    console.log('✏️ 상품 수정 중:', id);
    
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error, '상품 수정');
    console.log('✅ 상품 수정 완료');
    return data;
  },

  async delete(id: string) {
    ensureSupabaseClient();
    console.log('🗑️ 상품 삭제 중:', id);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) handleError(error, '상품 삭제');
    console.log('✅ 상품 삭제 완료');
  }
};

// 예약 관련 함수
export const appointmentApi = {
  async getAll() {
    ensureSupabaseClient();
    console.log('🔍 예약 목록 조회 중...');
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('datetime', { ascending: false });
    
    if (error) handleError(error, '예약 목록 조회');
    console.log(`✅ 예약 ${data?.length || 0}건 조회 완료`);
    return data;
  },

  async getByCustomer(customerId: string) {
    ensureSupabaseClient();
    console.log('🔍 고객별 예약 조회 중:', customerId);
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('customer_id', customerId)
      .order('datetime', { ascending: false });
    
    if (error) handleError(error, '고객별 예약 조회');
    console.log(`✅ ${data?.length || 0}건 조회 완료`);
    return data;
  },

  async create(appointment: Omit<SupabaseAppointment, 'id' | 'created_at' | 'updated_at'>) {
    ensureSupabaseClient();
    console.log('➕ 예약 추가 중');
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single();
    
    if (error) handleError(error, '예약 추가');
    console.log('✅ 예약 추가 완료');
    return data;
  },

  async update(id: string, appointment: Partial<SupabaseAppointment>) {
    ensureSupabaseClient();
    console.log('✏️ 예약 수정 중:', id);
    
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error, '예약 수정');
    console.log('✅ 예약 수정 완료');
    return data;
  },

  async delete(id: string) {
    ensureSupabaseClient();
    console.log('🗑️ 예약 삭제 중:', id);
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) handleError(error, '예약 삭제');
    console.log('✅ 예약 삭제 완료');
  }
};

// 재무 관련 함수
export const financeApi = {
  async getAll() {
    ensureSupabaseClient();
    console.log('🔍 재무 기록 조회 중...');
    
    const { data, error } = await supabase
      .from('finance')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) handleError(error, '재무 기록 조회');
    console.log(`✅ 재무 기록 ${data?.length || 0}건 조회 완료`);
    return data;
  },

  async create(finance: Omit<SupabaseFinance, 'id' | 'created_at' | 'updated_at'>) {
    ensureSupabaseClient();
    console.log('➕ 재무 기록 추가 중:', finance.title);
    
    const { data, error } = await supabase
      .from('finance')
      .insert([finance])
      .select()
      .single();
    
    if (error) handleError(error, '재무 기록 추가');
    console.log('✅ 재무 기록 추가 완료');
    return data;
  },

  async update(id: string, finance: Partial<SupabaseFinance>) {
    ensureSupabaseClient();
    console.log('✏️ 재무 기록 수정 중:', id);
    
    const { data, error } = await supabase
      .from('finance')
      .update(finance)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error, '재무 기록 수정');
    console.log('✅ 재무 기록 수정 완료');
    return data;
  },

  async delete(id: string) {
    ensureSupabaseClient();
    console.log('🗑️ 재무 기록 삭제 중:', id);
    
    const { error } = await supabase
      .from('finance')
      .delete()
      .eq('id', id);
    
    if (error) handleError(error, '재무 기록 삭제');
    console.log('✅ 재무 기록 삭제 완료');
  },

  async getMonthlyStats(yearMonth: string) {
    ensureSupabaseClient();
    console.log('📊 월별 통계 조회 중:', yearMonth);
    
    const { data, error } = await supabase
      .rpc('get_monthly_finance_stats', { year_month: yearMonth });
    
    if (error) handleError(error, '월별 통계 조회');
    console.log('✅ 월별 통계 조회 완료');
    return data;
  }
};

// 데이터 변환 함수
export const transformCustomer = (supabaseCustomer: SupabaseCustomer) => ({
  id: supabaseCustomer.id,
  name: supabaseCustomer.name,
  phone: supabaseCustomer.phone,
  birthDate: supabaseCustomer.birth_date,
  skinType: supabaseCustomer.skin_type,
  memo: supabaseCustomer.memo,
  point: supabaseCustomer.point,
  createdAt: supabaseCustomer.created_at,
  updatedAt: supabaseCustomer.updated_at,
});

export const transformProduct = (supabaseProduct: SupabaseProduct) => ({
  id: supabaseProduct.id,
  name: supabaseProduct.name,
  price: supabaseProduct.price,
  type: supabaseProduct.type,
  count: supabaseProduct.count,
  status: supabaseProduct.status,
  description: supabaseProduct.description,
});

export const transformAppointment = (supabaseAppointment: SupabaseAppointment) => ({
  id: supabaseAppointment.id,
  customerId: supabaseAppointment.customer_id,
  productId: supabaseAppointment.product_id,
  datetime: supabaseAppointment.datetime,
  memo: supabaseAppointment.memo,
  status: supabaseAppointment.status,
});

export const transformFinance = (supabaseFinance: SupabaseFinance) => ({
  id: supabaseFinance.id,
  date: supabaseFinance.date,
  type: supabaseFinance.type,
  title: supabaseFinance.title,
  amount: supabaseFinance.amount,
  memo: supabaseFinance.memo,
});