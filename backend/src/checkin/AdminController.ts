import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('admin')
export class AdminController {

  @Post('login')
  loginAdmin(@Body() body: { username: string; pass: string }) {
    // Vous pouvez remplacer ces valeurs par process.env.ADMIN_USER et process.env.ADMIN_PASS
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'amsaii2026';

    if (body.username === adminUser && body.pass === adminPass) {
      return { 
        success: true, 
        token: 'amsaii-admin-secure-token-xyz' 
      };
    }

    throw new UnauthorizedException('Identifiants incorrects.');
  }
}