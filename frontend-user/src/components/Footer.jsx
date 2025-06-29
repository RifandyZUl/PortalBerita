import { FaInstagram, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 text-sm pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start">
        {/* Kolom 1: Tautan */}
        <div className="pl-4">
          <h3 className="font-semibold mb-4">TAUTAN</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://winnicode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition flex items-center gap-2"
              >
                <FaGlobe className="text-base" />
                www.winnicode.com
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-pink-400 transition flex items-center gap-2"
              >
                <FaInstagram className="text-base" />
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Kolom 2: Kontak Kami */}
        <div>
          <h3 className="font-semibold mb-4">KONTAK KAMI</h3>
          <p className="mb-1">E-Mail: winnicodegaruda@gmail.com</p>
          <p className="mb-4">Call Center: 62815199932501 (24 Jam)</p>

          <div className="space-y-3">
            <div>
              <p className="font-semibold">Alamat Cabang Bandung:</p>
              <p>Jl. Asia Afrika No.158, Sumur Bandung, Kota Bandung</p>
            </div>
            <div>
              <p className="font-semibold">Alamat Cabang Yogyakarta:</p>
              <p>Bantul, Yogyakarta</p>
            </div>
            <div>
              <p className="font-semibold">Alamat Cabang Jakarta:</p>
              <p>Bekasi, Jawa Barat</p>
            </div>
            <div>
              <p className="font-semibold">Administrator Berkas:</p>
              <p>Hubungi Admin Telp: 62815199932501</p>
            </div>
          </div>
        </div>

        {/* Kolom 3: Logo + Tentang Kami */}
        <div className="flex flex-col justify-start items-start h-full pr-4">
          <img
            src="/logo/WinniCode.png"
            alt="Winnicode Logo"
            className="h-44 w-auto object-contain"
          />
          <p className="text-justify leading-relaxed">
            Jurnalistik Program <strong>winnicode</strong> adalah program pengembangan sumber daya manusia yang ditujukan bagi pemuda-pemudi yang berkari di dunia report.
          </p>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-400 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} PT. WINNICODE GARUDA TEKNOLOGI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
