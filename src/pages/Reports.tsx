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
  MoreVertical,
  Eye,
  CheckCircle,
  RefreshCw,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Report, ReportStatus } from '@/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        profiles:student_id (full_name, class)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Gagal mengambil data laporan');
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
  }, []);

  const updateStatus = async (id: string, newStatus: ReportStatus) => {
    const { error } = await supabase
      .from('reports')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) {
      toast.error('Gagal memperbarui status');
    } else {
      toast.success(`Status diperbarui ke ${newStatus}`);
      fetchReports();
      setIsDetailOpen(false);
    }
  };

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
    report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Daftar Laporan</h2>
          <p className="text-slate-500">Kelola dan tindak lanjuti laporan bullying dari siswa.</p>
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
          <Button variant="outline" size="icon" onClick={fetchReports}>
            <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelapor</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  Tidak ada laporan ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id} className="group">
                  <TableCell className="font-medium">
                    {format(new Date(report.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 p-1.5 rounded-full">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{report.student_name}</p>
                        <p className="text-xs text-slate-500">{report.student_class}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Opsi Laporan</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedReport(report);
                          setIsDetailOpen(true);
                        }}>
                          <Eye className="w-4 h-4 mr-2" /> Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-primary"
                          onClick={() => updateStatus(report.id, 'diproses')}
                          disabled={report.status === 'diproses'}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" /> Proses Laporan
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-green-600"
                          onClick={() => updateStatus(report.id, 'selesai')}
                          disabled={report.status === 'selesai'}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Selesaikan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Detail Laporan</DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai kejadian bullying yang dilaporkan.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Pelapor</p>
                  <p className="font-bold text-slate-900">{selectedReport.student_name}</p>
                  <p className="text-xs text-slate-500">{selectedReport.student_class}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Status</p>
                  {getStatusBadge(selectedReport.status)}
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Lokasi</p>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {selectedReport.location}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Tanggal Kejadian</p>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {format(new Date(selectedReport.incident_date), 'dd MMMM yyyy', { locale: localeId })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium uppercase mb-2">Deskripsi Kejadian</p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-700 leading-relaxed">
                  "{selectedReport.description}"
                </div>
              </div>

              {selectedReport.evidence_url && (
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-2">Bukti Pendukung</p>
                  <img 
                    src={selectedReport.evidence_url} 
                    alt="Bukti" 
                    className="rounded-xl max-h-64 object-cover border border-slate-200" 
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
            {selectedReport?.status !== 'selesai' && (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => selectedReport && updateStatus(selectedReport.id, 'selesai')}
              >
                Tandai Selesai
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <RefreshCw className={cn("animate-spin", className)} />
);
