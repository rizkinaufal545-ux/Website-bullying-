import React, { useEffect, useState } from 'react';
import { 
  UserSquare2, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  MoreVertical, 
  GraduationCap,
  Trash2,
  Edit2,
  RefreshCw,
  Loader2,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { StudentData } from '@/types';
import { toast } from 'sonner';

export const StudentDataPage: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form state
  const [nis, setNis] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students_data')
      .select('*')
      .order('class', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) {
      toast.error('Gagal mengambil data siswa');
    } else if (data) {
      setStudents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('students_data')
        .insert({ nis, name, class: className });

      if (error) throw error;

      toast.success('Data siswa berhasil ditambahkan');
      fetchStudents();
      setIsAddOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambah data siswa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNis('');
    setName('');
    setClassName('');
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Data Siswa</h2>
          <p className="text-slate-500">Kelola database siswa SMK Prima Unggul.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari siswa..." 
              className="pl-10 w-full md:w-[300px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Siswa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Total Siswa</p>
                <p className="text-3xl font-bold">{students.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Jurusan TKJ</p>
                <p className="text-3xl font-bold text-slate-900">{students.filter(s => s.class.includes('TKJ')).length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Jurusan RPL</p>
                <p className="text-3xl font-bold text-slate-900">{students.filter(s => s.class.includes('RPL')).length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-2xl">
                <RefreshCw className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Daftar Siswa</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" /> Import
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIS</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                  Tidak ada data siswa.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.nis}>
                  <TableCell className="font-mono text-sm">{student.nis}</TableCell>
                  <TableCell className="font-bold text-slate-900">{student.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {student.class}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Data Siswa</DialogTitle>
            <DialogDescription>
              Masukkan data siswa baru ke dalam database sekolah.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nis">NIS (Nomor Induk Siswa)</Label>
                <Input 
                  id="nis" 
                  placeholder="Contoh: 2021001" 
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  placeholder="Masukkan nama lengkap siswa" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Kelas</Label>
                <Input 
                  id="class" 
                  placeholder="Contoh: X-RPL-1" 
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Simpan Data
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
