const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 text-sm pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Kolom 1: Tautan */}
        <div>
          <h3 className="font-semibold mb-4">TAUTAN</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://winnicode.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                🌐 www.winnicode.com
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                📷 Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Kolom 2: Kontak Kami */}
        <div>
          <h3 className="font-semibold mb-4">KONTAK KAMI</h3>
          <p>E-Mail: winnicodegaruda@gmail.com</p>
          <p>Call Center: 62815199932501 (24 Jam)</p>
          <br />
          <p>Alamat Cabang Bandung:</p>
          <p>Jl. Asia Afrika No.158, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40261</p>
          <br />
          <p>Alamat Cabang Yogyakarta:</p>
          <p>Bantul, Yogyakarta</p>
          <br />
          <p>Alamat Cabang Jakarta:</p>
          <p>Bekasi, Jawa Barat</p>
          <br />
          <p>Administrator Berkas:</p>
          <p>Hubungi Admin Telp: 62815199932501</p>
        </div>

        {/* Kolom 3: Tentang Kami */}
        <div>
          <div className="mb-4">
            <span className="font-bold text-lg text-pink-400">Winni</span><span className="font-bold text-lg text-white">Code</span>
          </div>
          <p>
            Jurnalistik Program winnicode adalah program pengembangan sumber daya manusia yang ditujukan bagi pemuda-pemudi yang berkari di dunia report.
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
