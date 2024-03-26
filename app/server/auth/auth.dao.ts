import { eq } from "drizzle-orm";
import { db } from "~/server/db/db";
import { users } from "~/server/db/schema/user";

export class AuthReadDao {
  async selectUserById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));

    return result[0];
  }

  async selectUserByEmail(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email));

    return user[0];
  }
}
