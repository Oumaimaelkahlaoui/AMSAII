import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
export class AppController {
  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello() {
    return {
      message: 'Backend AMSAII fonctionne 🚀',
    };
  }

  @Get('test-supabase')
  async testSupabase() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('apartments')
      .select('*');

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      apartments: data,
    };
  }
}