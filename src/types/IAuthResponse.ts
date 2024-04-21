export interface IAuthLoginResponse {
  jwt_token: string;
}

export interface IAuthRegisterResponse {
  id: number;
  name: string;
  email: string;
  roles: string[];
}
