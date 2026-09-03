import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CheckinService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async handleDocumentUpload(files: Array<Express.Multer.File>, body: any) {
    const client = this.supabaseService.getClient();

    let frontPath: string | null = null;
    let backPath: string | null = null;

    if (files && files.length > 0) {
      for (const file of files) {
        const sanitizedName = file.originalname
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9.-]/g, '_');

        const fileName = `${Date.now()}-${sanitizedName}`;

        const { error } = await client.storage
          .from('checkin-documents')
          .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (error) {
          throw new BadRequestException(`Erreur upload storage: ${error.message}`);
        }

        if (file.fieldname === 'front') frontPath = fileName;
        if (file.fieldname === 'back') backPath = fileName;
      }
    }

    // ⬇️ Normalisation : la contrainte SQL attend 'CIN' / 'PASSPORT' en majuscules
    const DOCUMENT_TYPE_MAP: Record<string, string> = {
      cin: 'CIN',
      passport: 'PASSPORT',
    };
    const normalizedDocType =
      DOCUMENT_TYPE_MAP[(body.docType || '').toLowerCase()] || 'CIN';

    const { data, error } = await client
      .from('identity_documents')
      .insert([
        {
          guest_id: body.guestId,
          document_type: normalizedDocType, // ⬅️ 'CIN' ou 'PASSPORT'
          document_number: body.documentNumber || null,
          front_path: frontPath,
          back_path: backPath,
          verification_status: 'pending',
        },
      ])
      .select();

    if (error) {
      throw new BadRequestException(`Erreur base de données: ${error.message}`);
    }

    return { success: true, data };
  }

  async saveSignature(signatureData: any) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('checkins')
      .update({
        status: 'Signé',
        signature_path: signatureData.signature,
        signed_at: new Date().toISOString(),
      })
      .eq('id', signatureData.guestId)
      .select();

    if (error) {
      throw new BadRequestException(`Erreur sauvegarde signature: ${error.message}`);
    }

    return { success: true, message: 'Check-in validé avec succès', data };
  }
}