// Import React agar bisa membuat komponen
import React from 'react';

/**
 * Komponen reusable untuk input form dengan label.
 * Props:
 * - label: string yang ditampilkan sebagai label input
 * - type: tipe input (text, password, email, dll)
 * - value: nilai input yang dikontrol dari komponen induk
 * - onChange: fungsi yang dijalankan saat input berubah
 * - name: nama input yang juga digunakan untuk id dan htmlFor
 */
const InputField = ({ label, type, value, onChange, name }) => {
  return (
    // Container untuk label dan input
    <div className="mb-4">
      {/* Label input, terkait dengan input melalui htmlFor */}
      <label className="block text-xl font-medium mb-2" htmlFor={name}>
        {label}
      </label>

      {/* Input field dengan styling responsif dan aksesibilitas */}
      <input
        id={name}             // ID input untuk menghubungkan dengan label
        name={name}           // Name input untuk digunakan dalam form
        type={type}           // Tipe input sesuai props (email, password, dll)
        value={value}         // Nilai input dikontrol dari state parent
        onChange={onChange}   // Event handler untuk perubahan input
        className="w-full h-12 px-4 text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required              // Wajib diisi (HTML5 validation)
      />
    </div>
  );
};

export default InputField;
