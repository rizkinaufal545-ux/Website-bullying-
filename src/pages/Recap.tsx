import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar as CalendarIcon,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Report } from '@/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'sonner';

export const Recap: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const fetchReports = async () => {
    setLoading(true);
    let query = supabase
      .from('reports')
      .select(`
        *,
        profiles:student_id (full_name, class)
      `)
      .order('created_at', { ascending: false });
    
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    
    if (error) {
      toast.error('Gagal mengambil data rekap');
    } else if (data) {
      const formattedReports = data.map((r: any) => ({
        ...r,
        student_name: r.is_anonymous ? 'Anonim' : r.profiles?.full_name || 'Tidak diketahui',
        student_class: r.profiles?.class || '-'
      }));
      setReports(formattedReports);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    processed: reports.filter(r => r.status === 'diproses').length,
    completed: reports.filter(r => r.status === 'selesai').length
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Rekap Laporan</h2>
          <p className="text-slate-500">Analisis dan unduh ringkasan data laporan bullying.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Download className="w-4 h-4" /> Unduh Laporan (PDF/Excel)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Laporan</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-2xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Menunggu</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/5 p-3 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Diproses</p>
                <p className="text-2xl font-bold text-slate-900">{stats.processed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Selesai</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Filter Data
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="diproses">Diproses</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Periode:</span>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Waktu</SelectItem>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="week">Minggu Ini</SelectItem>
                    <SelectItem value="month">Bulan Ini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Pelapor</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    Tidak ada data untuk filter ini.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, index) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-slate-500">{index + 1}</TableCell>
                    <TableCell>{format(new Date(report.created_at), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-slate-900">{report.student_name}</p>
                        <p className="text-xs text-slate-500">{report.student_class}</p>
                      </div>
                    </TableCell>
                    <TableCell>{report.location}</TableCell>
                    <TableCell>
                      {report.status === 'pending' && <Badge className="bg-amber-100 text-amber-700 border-amber-200">Menunggu</Badge>}
                      {report.status === 'diproses' && <Badge className="bg-primary/10 text-primary border-primary/20">Diproses</Badge>}
                      {report.status === 'selesai' && <Badge className="bg-green-100 text-green-700 border-green-200">Selesai</Badge>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
