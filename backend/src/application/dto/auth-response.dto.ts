export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponseDto {
  user: AuthUserDto;
  token: string;
}
