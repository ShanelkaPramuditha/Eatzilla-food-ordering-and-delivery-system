export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
}

export interface RefreshToken {
  sub: string;
  refreshToken: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface UserRequest extends Request {
  user: JwtPayload;
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
}
