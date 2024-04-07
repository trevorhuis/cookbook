import bcrypt from "bcryptjs";
import { UserReadDao, UserWriteDao } from "~/server/users/user.dao";
import { InsertUserSchema, SelectUserSchema } from "./user.dataclass";
import { logger } from "~/utils";

export class UserUseCase {
  userWriteDao: UserWriteDao;
  userReadDao: UserReadDao;

  constructor() {
    this.userWriteDao = new UserWriteDao();
    this.userReadDao = new UserReadDao();
  }

  async getUserByEmail(email: SelectUserSchema["email"]) {
    try {
      const user = await this.userReadDao.selectUserByEmail(email);
      return { success: true, user };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }

  async createUser(data: InsertUserSchema) {
    try {
      const existingUser = await this.userReadDao.selectUserByEmail(data.email);

      if (existingUser) return { success: false };

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const userWithHashedPassword = {
        ...data,
        password: hashedPassword,
      };

      const insertedUserId = await this.userWriteDao.insertUser(
        userWithHashedPassword,
      );

      return {
        success: true,
        userId: insertedUserId,
        userEmail: data.email,
      };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }
}
