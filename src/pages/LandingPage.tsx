import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  School,
  Cpu,
  Code,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-primary">SMK Prima Unggul</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-semibold">Login</Button>
          </Link>
          <Link to="/login">
            <Button className="font-semibold shadow-lg shadow-primary/20">Lapor Sekarang</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Stop Bullying Sekarang!
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Ciptakan Sekolah <span className="text-primary">Aman</span> & <span className="text-secondary">Nyaman</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              Platform pelaporan bullying resmi SMK Prima Unggul. Lindungi diri Anda dan teman-teman dengan melaporkan tindakan tidak terpuji secara aman dan rahasia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2">
                  Mulai Melapor <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
              alt="Students collaborating" 
              className="relative rounded-3xl shadow-2xl border-8 border-white object-cover aspect-[4/3]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-bold text-slate-900">Anonim</span>
              </div>
              <p className="text-xs text-slate-500">Laporan Anda dapat dikirim tanpa identitas.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-4xl font-black text-primary mb-2">100%</h3>
            <p className="text-slate-600 font-medium">Kerahasiaan Terjamin</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-4xl font-black text-primary mb-2">24/7</h3>
            <p className="text-slate-600 font-medium">Akses Pelaporan</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-4xl font-black text-primary mb-2">Real-time</h3>
            <p className="text-slate-600 font-medium">Pemantauan Kasus</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">Mengapa Harus Melapor?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Bullying bukan sekadar candaan. Dampaknya bisa sangat serius bagi kesehatan mental dan masa depan siswa.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Perlindungan Korban</h3>
            <p className="text-slate-600 leading-relaxed">Memberikan rasa aman bagi korban dan memastikan mereka mendapatkan bantuan yang diperlukan.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-gold-50 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Edukasi Pelaku</h3>
            <p className="text-slate-600 leading-relaxed">Membantu pelaku menyadari kesalahan dan memberikan pembinaan agar tidak mengulangi perbuatannya.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Budaya Positif</h3>
            <p className="text-slate-600 leading-relaxed">Membangun lingkungan sekolah yang saling menghargai dan mendukung satu sama lain.</p>
          </div>
        </div>
      </section>

      {/* School Profile */}
      <section className="bg-primary py-24 px-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <School className="w-10 h-10 text-secondary" />
                <h2 className="text-3xl font-bold">Profil Sekolah</h2>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black mb-6">SMK Prima Unggul</h3>
              <p className="text-lg text-white/80 mb-10 leading-relaxed">
                Sekolah Menengah Kejuruan yang berdedikasi untuk mencetak generasi unggul di bidang teknologi dan kreatif. Kami berkomitmen menciptakan lingkungan belajar yang bebas dari bullying.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <Cpu className="w-8 h-8 text-secondary mb-3" />
                  <h4 className="font-bold">TKJ</h4>
                  <p className="text-xs text-white/60">Teknik Komputer & Jaringan</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <Code className="w-8 h-8 text-secondary mb-3" />
                  <h4 className="font-bold">RPL</h4>
                  <p className="text-xs text-white/60">Rekayasa Perangkat Lunak</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <Layers className="w-8 h-8 text-secondary mb-3" />
                  <h4 className="font-bold">MM</h4>
                  <p className="text-xs text-white/60">Multimedia</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=500" className="rounded-2xl shadow-xl" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=500" className="rounded-2xl shadow-xl mt-8" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="font-bold text-slate-900">SMK Prima Unggul</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 SMK Prima Unggul. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-primary transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
