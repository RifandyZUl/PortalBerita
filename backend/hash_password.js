// hash_password.js
import bcrypt from 'bcryptjs';

// Ambil password dari argumen CLI atau environment variable
const inputPassword = process.argv[2] || process.env.ADMIN_INITIAL_PASSWORD;

if (!inputPassword) {
  console.log('Penggunaan: node hash_password.js <password>');
  console.log('Contoh: node hash_password.js sandiBaru123');
  process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(inputPassword, salt);

console.log('Hashed password:', hash);
