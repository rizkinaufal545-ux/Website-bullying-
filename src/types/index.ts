export type UserRole = 'admin' | 'guru' | 'siswa';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  nis?: string;
  class?: string;
  created_at: string;
}

export type ReportStatus = 'pending' | 'diproses' | 'selesai';

export interface Report {
  id: string;
  student_id: string;
  description: string;
  location: string;
  incident_date: string;
  status: ReportStatus;
  is_anonymous: boolean;
  evidence_url?: string;
  created_at: string;
  // Joined data
  student_name?: string;
  student_class?: string;
}

export interface StudentData {
  nis: string;
  name: string;
  class: string;
}
