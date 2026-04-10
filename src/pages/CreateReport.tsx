import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Send, 
  MapPin, 
  Calendar as CalendarIcon, 
  FileText, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  EyeOff,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const CreateReport: React.FC = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User tidak ditemukan');

      const { error } = await supabase.from('reports').insert({
        student_id: user.id,
        description,
        location,
        incident_date: incidentDate,
        is_anonymous: isAnonymous,
        status: 'pending'
      });

      if (error) throw error;

      toast.success('Laporan berhasil dikirim!');
      navigate('/app/history');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Buat Laporan Baru</h2>
          <p className="text-slate-500">Sampaikan kejadian yang Anda alami atau lihat dengan detail.</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Formulir Pelaporan
            </CardTitle>
            <CardDescription>
              Informasi yang Anda berikan akan dijaga kerahasiaannya.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Kejadian</Label>
                <Textarea
                  id="description"
                  placeholder="Ceritakan apa yang terjadi secara detail..."
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi Kejadian</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="location"
                      placeholder="Misal: Kantin, Kelas X-RPL"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal Kejadian</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bukti Foto (Opsional)</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Klik untuk unggah atau seret file ke sini</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Checkbox 
                  id="anonymous" 
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(!!checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="anonymous"
                    className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    {isAnonymous ? <EyeOff className="w-4 h-4 text-primary" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    Laporkan secara Anonim
                  </label>
                  <p className="text-xs text-slate-500">
                    Nama Anda tidak akan ditampilkan pada laporan jika opsi ini dipilih.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Pastikan informasi yang Anda berikan adalah benar dan dapat dipertanggungjawabkan.
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button type="button" variant="ghost" onClick={() => navigate('/app')}>Batal</Button>
              <Button type="submit" className="gap-2 px-8 font-bold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    Kirim Laporan <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
