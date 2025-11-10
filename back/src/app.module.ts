import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UserModule } from './user/infrastructure/user.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { AuthModule } from './auth/infrastructure/auth.module';
import { FeatureFlagModule } from '@/feature-flag/infrastructure/feature-flag.module';
import { AppUserModule } from '@/app-user/infrastructure/app-user.module';
import { UserFeatureFlagsModule } from '@/user-feature-flags/infrastructure/user-feature-flags.module';

@Module({
  imports: [
    EnvConfigModule,
    UserModule,
    DatabaseModule,
    AuthModule,
    FeatureFlagModule,
    AppUserModule,
    UserFeatureFlagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
