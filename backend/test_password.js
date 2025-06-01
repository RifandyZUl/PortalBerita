import bcrypt from 'bcryptjs';

const plainPassword = 'admin123';
const hashedPassword = '$2b$10$lbbe6dKis8TKGOA6jZhkCe4PaQlzq/tvHRtp0eiIT4wm0/ZAgAZbq'; // copy dari database

const match = await bcrypt.compare(plainPassword, hashedPassword);
console.log('Password cocok?', match);
