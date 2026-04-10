import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Users,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Profile, Report, UserRole } from '@/types';

export const Dashboard: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processed: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setRole(profileData.role);
          setProfile(profileData);
          
          // Fetch stats based on role
          let query = supabase.from('reports').select('*', { count: 'exact' });
          
          if (profileData.role === 'siswa') {
            query = query.eq('student_id', user.id);
          }

          const { data: reports } = await query;
          
          if (reports) {
            setStats({
              total: reports.length,
              pending: reports.filter(r => r.status === 'pending').length,
              processed: reports.filter(r => r.status === 'diproses').length,
              completed: reports.filter(r => r.status === 'selesai').length
            });
          }
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Laporan', 
      value: stats.total, 
      icon: FileText, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Menunggu', 
      value: stats.pending, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      title: 'Diproses', 
      value: stats.processed, 
      icon: TrendingUp, 
      color: 'text-primary', 
      bg: 'bg-primary/5' 
    },
    { 
      title: 'Selesai', 
      value: stats.completed, 
      icon: CheckCircle2, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Halo, {profile?.full_name}!</h2>
        <p className="text-slate-500">Selamat datang di dashboard {role === 'siswa' ? 'Siswa' : role === 'guru' ? 'Guru/BK' : 'Administrator'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-2xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Informasi Penting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-1">Apa itu Bullying?</h4>
              <p className="text-sm text-slate-600">Bullying adalah perilaku tidak menyenangkan baik secara verbal, fisik, ataupun sosial di dunia nyata maupun dunia maya yang membuat seseorang merasa tidak nyaman, sakit hati dan tertekan baik dilakukan oleh perorangan ataupun kelompok.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-1">Cara Melapor</h4>
              <p className="text-sm text-slate-600">Klik menu "Buat Laporan", isi detail kejadian dengan jujur, dan sertakan bukti jika ada. Laporan Anda akan ditinjau oleh tim BK secara rahasia.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-secondary" />
              Kontak Darurat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Tim BK Sekolah</p>
                <p className="text-xs text-slate-500">0812-3456-7890</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="bg-secondary/10 p-2 rounded-full">
                <ShieldAlert className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Keamanan Sekolah</p>
                <p className="text-xs text-slate-500">0812-9876-5432</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
