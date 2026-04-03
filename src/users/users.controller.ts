import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SaveClinicalInfoDto } from './dto/save-clinical-info.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: { user: { sub: string } }) {
    const user = await this.usersService.findById(req.user.sub);

    return {
      user: user ? this.usersService.serializeUser(user) : null,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/clinical-info')
  async saveClinicalInfo(
    @Param('id') id: string,
    @Body() body: SaveClinicalInfoDto,
    @Req() req: { user: { sub: string } },
  ) {
    const user = await this.usersService.updateClinicalInfo(req.user.sub, id, body);

    return {
      message: 'Informações clínicas salvas com sucesso.',
      user: this.usersService.serializeUser(user),
    };
  }
}
