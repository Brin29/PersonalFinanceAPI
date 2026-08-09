export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  avatar: string;
  provider: string;
  password: string;
  role: string;
  isVerified: boolean;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}