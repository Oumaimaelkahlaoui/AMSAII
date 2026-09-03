import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Res,
    NotFoundException,
    StreamableFile,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import type { Response } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { CheckinService } from './checkin.service';

@Controller('checkin')
export class CheckinController {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly checkinService: CheckinService,
    ) { }

    @Post('sign-pdf')
    async signPdfContract(
        @Body() body: { email: string; guestId: string; signature: string },
    ) {
        const { email, guestId, signature } = body;

        const pdfPath = path.join(process.cwd(), 'assets', 'contrat-location-amsaii.pdf');
        const existingPdfBytes = fs.readFileSync(pdfPath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const base64Data = signature.replace(/^data:image\/png;base64,/, '');
        const signatureImageBytes = Buffer.from(base64Data, 'base64');
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

        const pages = pdfDoc.getPages();
        const lastPage = pages[pages.length - 1];

        lastPage.drawImage(signatureImage, {
            x: 320,
            y: 350,
            width: 130,
            height: 45,
        });

        const modifiedPdfBytes = await pdfDoc.save();

        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const outputPath = path.join(uploadDir, `contrat-signe-${guestId}.pdf`);
        fs.writeFileSync(outputPath, modifiedPdfBytes);

        const { error: updateError } = await this.supabaseService
            .getClient()
            .from('checkins')
            .update({
                status: 'Signé',
                signed_at: new Date().toISOString(),
            })
            .eq('id', guestId);

        if (updateError) {
            console.error('Erreur mise à jour Supabase :', updateError);
        }

        return { success: true, message: 'PDF signé et généré avec succès.' };
    }

  @Get('all')
async getAllCheckins() {
  const client = this.supabaseService.getClient();

  const { data: checkins, error } = await client
    .from('checkins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // ⬇️ CORRIGÉ : uploaded_at (pas created_at) + on exclut les docs supprimés
  const { data: documents, error: docsError } = await client
    .from('identity_documents')
    .select('*')
    .is('deleted_at', null);

  if (docsError) {
    console.error('Erreur récupération identity_documents :', docsError);
  }

  const merged = await Promise.all(
    (checkins || []).map(async (guest) => {
      const guestDocs = (documents || []).filter(
        (d) => d.guest_id === guest.id,
      );
      // ⬇️ CORRIGÉ : tri sur uploaded_at
      const doc = guestDocs.sort(
        (a, b) =>
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime(),
      )[0];

      if (!doc) {
        return {
          ...guest,
          document_type: null,
          front_document_url: null,
          back_document_url: null,
        };
      }

      const [frontSigned, backSigned] = await Promise.all([
        doc.front_path
          ? client.storage
              .from('checkin-documents')
              .createSignedUrl(doc.front_path, 3600)
          : Promise.resolve({ data: null }),
        doc.back_path
          ? client.storage
              .from('checkin-documents')
              .createSignedUrl(doc.back_path, 3600)
          : Promise.resolve({ data: null }),
      ]);

      return {
        ...guest,
        document_type: doc.document_type,
        front_document_url: frontSigned.data?.signedUrl || null,
        back_document_url: backSigned.data?.signedUrl || null,
      };
    }),
  );

  return merged;
}

    @Get('download/:guestId')
    downloadSignedPdf(
        @Param('guestId') guestId: string,
        @Res({ passthrough: true }) res: Response,
    ): StreamableFile {
        const filePath = path.join(
            process.cwd(),
            'uploads',
            `contrat-signe-${guestId}.pdf`,
        );

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('Le contrat signé est introuvable.');
        }

        const file = fs.createReadStream(filePath);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="contrat-signe-${guestId}.pdf"`,
        });

        return new StreamableFile(file);
    }

    @Post('init')
    async initCheckin(
        @Body()
        body: { firstName: string; lastName: string; email: string; phone: string },
    ) {
        const { firstName, lastName, email, phone } = body;

        const { data, error } = await this.supabaseService
            .getClient()
            .from('checkins')
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    status: 'En attente',
                },
            ])
            .select()
            .single();

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true, id: data.id, data };
    }

    @Post('upload')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'front', maxCount: 1 },
                { name: 'back', maxCount: 1 },
            ],
            { storage: memoryStorage() },
        ),
    )
    async uploadDocuments(
        @UploadedFiles()
        files: { front?: Express.Multer.File[]; back?: Express.Multer.File[] },
        @Body() body: any,
    ) {
        try {
            const guestId = body?.guestId;

            if (!guestId) {
                return {
                    success: false,
                    message: 'ID du voyageur manquant dans la requête.',
                };
            }

            const allFiles = [...(files?.front || []), ...(files?.back || [])];

            const result = await this.checkinService.handleDocumentUpload(
                allFiles,
                body,
            );

            const { error } = await this.supabaseService
                .getClient()
                .from('checkins')
                .update({ status: 'En attente signature' })
                .eq('id', guestId);

            if (error) {
                console.error('Erreur Supabase (upload, statut) :', error);
            }

            return {
                success: true,
                message: 'Documents enregistrés avec succès',
                data: result.data,
            };
        } catch (err: any) {
            console.error('Exception interne (upload) :', err.message);
            return { success: false, message: err.message };
        }
    }
}