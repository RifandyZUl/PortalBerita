import bcrypt from 'bcryptjs';

const plainPassword = 'admin123';
const hashedPassword = '$2b$10$mEGjJVVQN9EowtXvaAu7GuJ8XwLRwSgZVwZM18aTWZCbFsYgb4Eju'; 

const match = await bcrypt.compare(plainPassword, hashedPassword);
console.log('Password cocok?', match);
