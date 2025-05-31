import { Database } from './database.types';

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Interview = Database['public']['Tables']['interviews']['Row'];
export type InterviewInsert = Database['public']['Tables']['interviews']['Insert'];
export type InterviewUpdate = Database['public']['Tables']['interviews']['Update'];

export type Report = Database['public']['Tables']['reports']['Row'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];
export type ReportUpdate = Database['public']['Tables']['reports']['Update'];