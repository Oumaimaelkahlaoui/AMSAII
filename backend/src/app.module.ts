import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { CheckinModule } from './checkin/checkin.module';
import { AdminController } from './checkin/AdminController'; // <--- Importez le contrôleur

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule, 
    CheckinModule
  ],
  controllers: [AppController, AdminController], // <--- Ajoutez-le ici pour enregistrer la route /admin/login
  providers: [AppService],
})
export class AppModule {}