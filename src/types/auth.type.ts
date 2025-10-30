export interface IUser {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  fullName: string;
  email: string;
  token: string;
}
