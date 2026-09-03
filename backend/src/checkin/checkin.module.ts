import { Module } from '@nestjs/common';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { SupabaseModule } from '../supabase/supabase.module'; // ajuste le chemin si besoin

@Module({
  imports: [SupabaseModule],
  controllers: [CheckinController],
  providers: [CheckinService],
})
export class CheckinModule {}