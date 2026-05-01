import { createClient } from "@supabase/supabase-js";

// 클라이언트 사이드 또는 서버 사이드에서 공통으로 사용할 수 있는 Supabase 인스턴스
// (서버 전용 권한이 필요할 경우 @supabase/ssr 패키지를 사용하는 것이 더 안전하나, 초기 셋업 편의성을 위해 기본 제공)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);
