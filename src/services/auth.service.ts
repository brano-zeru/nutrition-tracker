import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma'; // מוודא שזה מצביע לקובץ שיצרנו ב-lib

export class AuthService {
  static async register(email: string, password: string, fullName: string) {
    // 1. בדיקה אם המשתמש כבר קיים במערכת
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // 2. הצפנת הסיסמה (Hashing)
    // אנחנו לא שומרים את ה-password האמיתי, אלא גרסה מעורבלת שלו
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. יצירת המשתמש החדש ב-Database
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash, // השדה מה-schema שלנו
        fullName,
      },
    });

    // 4. החזרת המשתמש ללא הסיסמה (אבטחה בסיסית)
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}