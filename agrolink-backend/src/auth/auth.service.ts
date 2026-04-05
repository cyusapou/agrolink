import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppRole } from './roles.decorator';

type DemoUser = {
  id: number;
  username: string;
  password: string;
  role: AppRole;
};

@Injectable()
export class AuthService {
  // Demo users for local development.
  private readonly users: DemoUser[] = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      accessToken,
      user: { id: user.id, username: user.username, role: user.role },
    };
  }
}

