import bcrypt from 'bcryptjs';

const plainPassword = 'admin12345';
const hashedPassword = '$2b$10$N.D5zfj21/NLDCvUg4PgIuJQ0dtlAXpHs2GmY6KeaOU76TV9loubO'; // copy dari database

const match = await bcrypt.compare(plainPassword, hashedPassword);
console.log('Password cocok?', match);
