export interface Usuario {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
}
