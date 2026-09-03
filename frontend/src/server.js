const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || 'VOTRE_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'VOTRE_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Route admin login
app.post('/admin/login', (req, res) => {
  const { username, pass } = req.body;
  if (username === 'admin' && pass === 'amsaii2026') {
    res.json({ success: true, token: 'fake-jwt-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants invalides' });
  }
});

// 1. Initialiser le check-in (Étape 1)
app.post('/checkin/init', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const { data, error } = await supabase
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
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, id: data.id, data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Erreur serveur lors de l'initialisation" });
  }
});

// 2. Gérer l'envoi des documents (Étape 2) — avec vrais fichiers
app.post(
  '/checkin/upload',
  upload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { guestId, docType } = req.body;

      if (!guestId) {
        return res.status(400).json({ success: false, message: 'ID du voyageur manquant.' });
      }

      let frontPath = null;
      let backPath = null;

      const allFiles = [
        ...(req.files?.front || []),
        ...(req.files?.back || []),
      ];

      for (const file of allFiles) {
        const sanitizedName = file.originalname
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9.-]/g, '_');

        const fileName = `${Date.now()}-${sanitizedName}`;

        const { error: uploadError } = await supabase.storage
          .from('checkin-documents')
          .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (uploadError) {
          return res.status(400).json({ success: false, message: uploadError.message });
        }

        if (file.fieldname === 'front') frontPath = fileName;
        if (file.fieldname === 'back') backPath = fileName;
      }

      const { error: docError } = await supabase.from('identity_documents').insert([
        {
          guest_id: guestId,
          document_type: docType || 'cin',
          front_path: frontPath,
          back_path: backPath,
          verification_status: 'pending',
        },
      ]);

      if (docError) {
        return res.status(400).json({ success: false, message: docError.message });
      }

      const { data, error } = await supabase
        .from('checkins')
        .update({ status: 'En attente signature' })
        .eq('id', guestId)
        .select();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ success: true, message: 'Documents enregistrés avec succès', data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de l'envoi des documents" });
    }
  },
);

// 3. Enregistrer la signature et valider le contrat (Étape 3)
app.post('/checkin/sign-pdf', async (req, res) => {
  try {
    const { guestId, signature } = req.body;

    const { data, error } = await supabase
      .from('checkins')
      .update({
        status: 'Signé',
        signature_path: signature,
        signed_at: new Date().toISOString(),
      })
      .eq('id', guestId)
      .select();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'Contrat signé et enregistré avec succès', data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Erreur lors de l'enregistrement de la signature" });
  }
});

app.get('/checkin/all', async (req, res) => {
  try {
    const { data: checkins, error } = await supabase
      .from('checkins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // ⬇️ CORRIGÉ : uploaded_at + exclusion des docs supprimés
    const { data: documents, error: docsError } = await supabase
      .from('identity_documents')
      .select('*')
      .is('deleted_at', null);

    if (docsError) {
      console.error('Erreur récupération identity_documents :', docsError);
    }

    const merged = await Promise.all(
      (checkins || []).map(async (guest) => {
        const guestDocs = (documents || []).filter((d) => d.guest_id === guest.id);
        const doc = guestDocs.sort(
          (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at),
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
            ? supabase.storage.from('checkin-documents').createSignedUrl(doc.front_path, 3600)
            : Promise.resolve({ data: null }),
          doc.back_path
            ? supabase.storage.from('checkin-documents').createSignedUrl(doc.back_path, 3600)
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

    res.json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
});

// 5. Télécharger le PDF signé d'un voyageur
app.get('/checkin/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.status(404).json({ error: "Fichier PDF non trouvé pour l'ID : " + id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du téléchargement' });
  }
});

app.listen(3001, () => {
  console.log('Serveur backend démarré sur le port 3001');
});