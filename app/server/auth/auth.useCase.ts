import {
  SessionData,
  SessionStorage,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";
import bcrypt from "bcryptjs";

import { AuthReadDao } from "./auth.dao";
import { logger } from "~/utils";

export class AuthUseCase {
  authReadDao: AuthReadDao;
  sessionStorage: SessionStorage<SessionData, SessionData>;
  #USER_SESSION_KEY = "userId";

  constructor() {
    this.authReadDao = new AuthReadDao();
    this.sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "__session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [process.env.SESSION_SECRET!],
        secure: process.env.NODE_ENV === "production",
      },
    });
  }

  async #getSession(request: Request) {
    const cookie = request.headers.get("Cookie");
    return this.sessionStorage.getSession(cookie);
  }

  async getUserId(request: Request) {
    const session = await this.#getSession(request);
    const userId = session.get(this.#USER_SESSION_KEY);
    return userId;
  }

  async getUserFromRequest(request: Request) {
    const userId = await this.getUserId(request);
    if (userId === undefined) return null;

    const user = await this.authReadDao.selectUserById(userId);
    if (user) return user;

    throw await this.logout(request);
  }

  async requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname,
  ) {
    const userId = await this.getUserId(request);
    if (!userId) {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/login?${searchParams}`);
    }
    return userId;
  }

  async requireUser(request: Request) {
    const userId = await this.requireUserId(request);

    const user = await this.authReadDao.selectUserById(userId);
    if (user) return user;

    throw await this.logout(request);
  }

  async createUserSession({
    request,
    userId,
    remember,
    redirectTo,
  }: {
    request: Request;
    userId: number;
    remember: boolean;
    redirectTo: string;
  }) {
    const session = await this.#getSession(request);
    session.set(this.#USER_SESSION_KEY, userId);
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.sessionStorage.commitSession(session, {
          maxAge: remember
            ? 60 * 60 * 24 * 7 // 7 days
            : undefined,
        }),
      },
    });
  }

  async logout(request: Request) {
    const session = await this.#getSession(request);
    return redirect("/", {
      headers: {
        "Set-Cookie": await this.sessionStorage.destroySession(session),
      },
    });
  }

  async verifyLogin(email: string, password: string) {
    try {
      const user = await this.authReadDao.selectUserByEmail(email);

      if (!user) throw new Error("User not found");
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error("Invalid password");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }

  validateEmail(email: unknown): email is string {
    return typeof email === "string" && email.length > 3 && email.includes("@");
  }
}
