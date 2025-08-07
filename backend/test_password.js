import bcrypt from 'bcryptjs';

const plainPassword = 'admin12345';
const hashedPassword = '$2b$10$t3YhPw6yRWkIKLMRTjuA3e6XF96JDyJw4JYKheXhW9wI.ogi9aZAe'; // copy dari database

const match = await bcrypt.compare(plainPassword, hashedPassword);
console.log('Password cocok?', match);
