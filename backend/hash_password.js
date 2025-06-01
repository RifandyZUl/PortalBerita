// hash-password.js
import bcrypt from 'bcryptjs';

const password = 'admin12345'; // ganti dengan password yang kamu inginkan
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Hashed password:', hash);
