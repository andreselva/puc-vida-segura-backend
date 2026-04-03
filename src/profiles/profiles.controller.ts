import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessProfileDto } from './dto/access-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post(':profileId/access')
  accessProfile(
    @Param('profileId') profileId: string,
    @Body() body: AccessProfileDto,
    @Headers('x-frontend-url') frontendUrl?: string,
  ) {
    return this.profilesService.accessPublicProfile(profileId, body.password, frontendUrl);
  }


  @Post(':profileId')
  accessProfileLegacy(
    @Param('profileId') profileId: string,
    @Body() body: AccessProfileDto,
    @Headers('x-frontend-url') frontendUrl?: string,
  ) {
    return this.profilesService.accessPublicProfile(profileId, body.password, frontendUrl);
  }

  @Get(':profileId/public')
  getPublicProfile(
    @Param('profileId') profileId: string,
    @Query('password') password?: string,
    @Headers('x-frontend-url') frontendUrl?: string,
  ) {
    return this.profilesService.accessPublicProfile(profileId, password, frontendUrl);
  }
}
