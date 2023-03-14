import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getData() {
    return this.userService.getData();
  }
  @Get('/report')
  getReport() {
    return this.userService.getReport();
  }
}
