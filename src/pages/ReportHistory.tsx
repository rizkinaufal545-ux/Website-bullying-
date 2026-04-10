import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Report } from '@/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export const ReportHistory: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('reports')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 gap-1"><Clock className="w-3 h-3" /> Menunggu</Badge>;
      case 'diproses':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1"><AlertCircle className="w-3 h-3" /> Diproses</Badge>;
      case 'selesai':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredReports = reports.filter(report => 
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Riwayat Laporan</h2>
          <p className="text-slate-500">Pantau status laporan yang telah Anda kirimkan.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari laporan..." 
              className="pl-10 w-full md:w-[300px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Belum ada laporan</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-1">Anda belum pernah mengirimkan laporan bullying. Klik tombol "Buat Laporan" untuk memulai.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-md transition-all cursor-pointer border-slate-100 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(report.created_at), 'dd MMMM yyyy', { locale: localeId })}
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1 mb-1">{report.description}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="w-4 h-4" />
                          {report.location}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          Kejadian: {format(new Date(report.incident_date), 'dd/MM/yyyy')}
                        </div>
                        {report.is_anonymous && (
                          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-slate-100 text-slate-600">Anonim</Badge>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-50 md:w-12 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 group-hover:bg-primary/5 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
