// verify_password.js
// Script untuk verify apakah hash password sesuai dengan password plain text
import bcrypt from 'bcryptjs';

const password = 'admins12345'; // Password yang di-input saat login
const hash = '$2b$10$1YoJF8g..RcWGz1ekt4Xye114g5vcgNHbzFWErxiNW8KaN/JQhb8i'; // Hash dari database

console.log('🔍 Verifying password...');
console.log('Password:', password);
console.log('Hash:', hash);

const isMatch = bcrypt.compareSync(password, hash);

if (isMatch) {
  console.log('✅ Password MATCH! Hash sudah benar.');
} else {
  console.log('❌ Password TIDAK MATCH! Hash salah atau password berbeda.');
  console.log('\n💡 Coba generate hash baru:');
  console.log('   node hash_password.js');
}

