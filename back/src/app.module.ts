import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UserModule } from './user/infrastructure/user.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { AuthModule } from './auth/infrastructure/auth.module';
import {FeatureFlagModule} from "@/feature-flag/infrastructure/feature-flag.module";

@Module({
  imports: [EnvConfigModule, UserModule, DatabaseModule, AuthModule, FeatureFlagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
