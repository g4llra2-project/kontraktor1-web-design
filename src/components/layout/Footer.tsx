/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ViewPath } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewPath) => void;
  onOpenEnquiry?: () => void;
}

export default function Footer({ onNavigate, onOpenEnquiry }: FooterProps) {
  const [timeStr, setTimeStr] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Use WIB (GMT+7)
      const wibTimeStr = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Get weekday and hour in Asia/Jakarta timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        weekday: 'short',
        hour: 'numeric',
        hour12: false,
      });
      const parts = formatter.formatToParts(now);
      const weekdayPart = parts.find(p => p.type === 'weekday');
      const hourPart = parts.find(p => p.type === 'hour');

      const weekdayIdx = weekdayPart ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekdayPart.value) : 1;
      const hour = hourPart ? parseInt(hourPart.value, 10) : 9;

      // Monday to Friday: 8:30am to 5:00pm (08:30 to 17:00)
      const officeOpen = weekdayIdx >= 1 && weekdayIdx <= 5 && hour >= 8 && hour < 17;

      setIsOpen(officeOpen);
      setTimeStr(`${wibTimeStr} WIB — kami sedang ${officeOpen ? 'buka' : 'tutup'}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-brand-black text-[#EDEAE3] pt-24 pb-12 px-6 md:px-12 flex flex-col border-t border-white/10" id="global-application-footer">
      <div className="max-w-7xl mx-auto w-full">
        {/* FOOTER COLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-16 border-b border-white/[0.08] mb-12">
          {/* NAVIGATION */}
          <div>
            <span className="text-[10px] uppercase font-serif italic tracking-[0.2em] text-[#EDEAE3]/40 mb-6 block">
              (Navigasi)
            </span>
            <ul className="flex flex-col gap-3 font-sans">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-xs tracking-wider text-[#EDEAE3]/70 hover:text-white hover:underline transition-all focus:outline-none cursor-pointer"
                  id="foot-nav-home"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('works')}
                  className="text-xs tracking-wider text-[#EDEAE3]/70 hover:text-white hover:underline transition-all focus:outline-none cursor-pointer"
                  id="foot-nav-works"
                >
                  Karya Terpilih
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('studio')}
                  className="text-xs tracking-wider text-[#EDEAE3]/70 hover:text-white hover:underline transition-all focus:outline-none cursor-pointer"
                  id="foot-nav-studio"
                >
                  Studio Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('process')}
                  className="text-xs tracking-wider text-[#EDEAE3]/70 hover:text-white hover:underline transition-all focus:outline-none cursor-pointer"
                  id="foot-nav-process"
                >
                  6 Tahapan Kerja
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kalkulator-rab')}
                  className="text-xs tracking-wider text-[#EDEAE3]/70 hover:text-white hover:underline transition-all focus:outline-none cursor-pointer"
                  id="foot-nav-rab"
                >
                  Kalkulator Estimasi RAB
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('generator-denah')}
                  className="text-xs tracking-wider text-[#EDEAE3]/70 hover:text-white hover:underline transition-all focus:outline-none cursor-pointer"
                  id="foot-nav-denah"
                >
                  Saran Penataan Denah (AI)
                </button>
              </li>
            </ul>
          </div>

          {/* HEADQUARTERS INFO */}
          <div>
            <span className="text-[10px] uppercase font-serif italic tracking-[0.2em] text-[#EDEAE3]/40 mb-6 block">
              (Informasi Utama)
            </span>
            <div className="flex flex-col gap-3.5 text-xs text-[#EDEAE3]/60 font-sans">
              <p className="flex items-start gap-3">
                <span className="text-[9px] font-semibold text-white/30 border border-white/20 px-1 py-0.5 rounded-xs">A</span>
                Jl. Wijaya Timur Raya No. 12, Kebayoran Baru, Jakarta Selatan 12170
              </p>
              <p className="flex items-center gap-3">
                <span className="text-[9px] font-semibold text-white/30 border border-white/20 px-1 py-0.5 rounded-xs">E</span>
                info@oh-architecture-build.id
              </p>
              <p className="flex items-center gap-3">
                <span className="text-[9px] font-semibold text-white/30 border border-white/20 px-1 py-0.5 rounded-xs">P</span>
                +62 (21) 7280 1024
              </p>
              <p className="flex items-center gap-3">
                <span className="text-[9px] font-semibold text-white/30 border border-white/20 px-1 py-0.5 rounded-xs">H</span>
                Senin - Jumat, 08:30 WIB – 17:00 WIB
              </p>

              <div className="flex gap-4 items-center mt-3">
                <div className="w-14 h-14 border border-white/12 rounded-full flex flex-col items-center justify-center text-[8px] tracking-tight leading-none text-center text-[#EDEAE3]/60 select-none font-sans">
                  <span className="font-semibold block mb-0.5">IAI</span>
                  Member
                </div>
                <div className="w-14 h-14 border border-white/12 rounded-full flex flex-col items-center justify-center text-[8px] tracking-tight leading-none text-center text-[#EDEAE3]/60 select-none font-sans">
                  <span className="font-semibold block mb-0.5">AIA</span>
                  Member
                </div>
              </div>
            </div>
          </div>

          {/* ACKNOWLEDGEMENT */}
          <div>
            <span className="text-[10px] uppercase font-serif italic tracking-[0.2em] text-[#EDEAE3]/40 mb-6 block">
              (Apresiasi Budaya)
            </span>
            <p className="text-[11px] leading-relaxed italic text-[#EDEAE3]/45 max-w-sm font-sans pt-1">
              Kami menghormati keragaman adat budaya Indonesia dan melestarikan kearifan lokal dalam setiap karya rancang-bangun kami. Kami bertekad mewujudkan arsitektur tropis yang berintegritas, ramah lingkungan, dan berdampak positif bagi masyarakat setempat.
            </p>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] text-[#EDEAE3]/30 font-sans">
          <span>&copy; {new Date().getFullYear()} OH Architecture &amp; Build. All rights reserved.</span>

          <div className="flex items-center gap-2" id="footer-live-clock">
            <span className={`w-2 h-2 rounded-full inline-block transition-colors shrink-0 ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="tracking-wide uppercase font-semibold">{timeStr}</span>
          </div>

          <div className="flex gap-6 items-center">
            <button
              onClick={() => onOpenEnquiry && onOpenEnquiry()}
              className="hover:text-white transition-colors focus:outline-none cursor-pointer uppercase font-semibold text-[9px] tracking-widest border border-white/20 px-3 py-1 bg-white/5"
            >
              Hubungi Kami
            </button>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-0.5 hover:text-white transition-colors">
              Instagram <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
