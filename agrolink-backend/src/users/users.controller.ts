import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, AppRole } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(AppRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @Get('profile/:id')
  @Roles(AppRole.ADMIN, AppRole.COOP_MANAGER, AppRole.BUYER)
  findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }
}
