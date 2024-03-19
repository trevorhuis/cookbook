import { UserDAO } from "./user.dao";

export class UserUseCase {
  userDao: UserDAO;

  constructor() {
    this.userDao = new UserDAO();
  }
}
