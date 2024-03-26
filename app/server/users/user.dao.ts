import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema/user";
import {
  InsertUserSchema,
  SelectUserSchema,
} from "~/server/users/user.dataclass";
import { db } from "~/server/db/db";

export class UserWriteDao {
  async insertUser(userWithHashedPassword: InsertUserSchema) {
    const userId = await db
      .insert(users)
      .values(userWithHashedPassword)
      .returning({ insertedId: users.id });

    return userId[0].insertedId;
  }
}
export class UserReadDao {
  async selectUserByEmail(email: SelectUserSchema["email"]) {
    const user = await db.select().from(users).where(eq(users.email, email));

    return user[0];
  }
}
