import { NextRequest, NextResponse } from 'next/server';

/**
 * Route API pour la génération de musique avec voix chantées réelles (Suno AI).
 * Supporte :
 * 1. Création de tâche Suno (POST)
 * 2. Polling du statut et récupération de l'audio MP3 (GET)
 * 3. Utilisation de la clé fournie via header X-Suno-Key ou variable d'environnement SUNO_API_KEY
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, lyrics, genre, vocalGender, mood, tempoBpm, isInstrumental, apiKey: bodyKey } = body;

    // Récupérer la clé API : soit du header, soit du body, soit de .env.local
    const headerKey = req.headers.get('x-suno-key');
    const sunoApiKey = headerKey || bodyKey || process.env.SUNO_API_KEY;
    const sunoApiUrl = process.env.SUNO_API_URL || 'https://api.aimusicapi.ai/api/v1/sonic';

    if (!sunoApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'SUNO_KEY_REQUIRED',
          requiresKey: true,
          provider: 'suno-ai',
          message:
            'Pour générer de véritables chansons complètes avec des voix humaines chantées (moteur Suno AI), veuillez configurer votre clé d\'API Suno dans votre profil ou fichier .env.local.',
          instructions: {
            title: 'Comment activer le chant IA Suno :',
            steps: [
              '1. Créez un compte sur une passerelle Suno API officielle (ex: aimusicapi.ai ou apiframe.ai)',
              '2. Récupérez votre jeton API personnel',
              '3. Collez votre clé dans l\'onglet Studio ou dans la page Profil',
            ],
          },
        },
        { status: 400 }
      );
    }

    // Préparation des métadonnées vocales et musicales
    const vocalStyle = vocalGender === 'female' ? 'female lead vocals' : vocalGender === 'duet' ? 'male and female duet vocals' : 'male lead vocals';
    const genreTag = genre || 'afrobeat';
    const tags = `${genreTag}, ${vocalStyle}, ${mood || 'energetic'}, ${tempoBpm || 104} BPM, modern radio production, clear singing vocals`;

    // Prompt de génération (paroles personnalisées ou description de la chanson)
    const songPrompt = lyrics || prompt || `Catchy ${genreTag} hit song with melodic vocal hook and chorus`;
    const songTitle = prompt ? prompt.slice(0, 36).trim() : `${genreTag.toUpperCase()} AI Vocal Song`;

    console.log('[Suno API Route] Creating song generation task with endpoint:', `${sunoApiUrl}/create`);

    // Appel à l'API Suno
    const createRes = await fetch(`${sunoApiUrl}/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sunoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: songPrompt,
        tags: tags,
        title: songTitle,
        mv: 'chirp-v4',
        instrumental: Boolean(isInstrumental),
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error('[Suno API Route] Provider error:', createRes.status, errText);
      return NextResponse.json(
        {
          success: false,
          error: 'SUNO_PROVIDER_ERROR',
          message: `Erreur du serveur Suno (${createRes.status}): ${errText}`,
        },
        { status: createRes.status }
      );
    }

    const data = await createRes.json();
    const taskId = data.task_id || data.id || data.data?.task_id;
    const directAudioUrl = data.audio_url || data.data?.audio_url;

    return NextResponse.json({
      success: true,
      provider: 'suno-ai',
      taskId: taskId,
      audioUrl: directAudioUrl || undefined,
      title: songTitle,
      tags: tags,
      message: 'Génération vocale Suno lancée avec succès !',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Suno API Route] Exception:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur interne lors de la requête Suno.',
      },
      { status: 500 }
    );
  }
}

/**
 * Handler GET pour vérifier le statut de génération d'une tâche Suno
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ success: false, error: 'taskId parameter is required' }, { status: 400 });
    }

    const headerKey = req.headers.get('x-suno-key');
    const sunoApiKey = headerKey || process.env.SUNO_API_KEY;
    const sunoApiUrl = process.env.SUNO_API_URL || 'https://api.aimusicapi.ai/api/v1/sonic';

    if (!sunoApiKey) {
      return NextResponse.json({ success: false, error: 'SUNO_KEY_REQUIRED' }, { status: 400 });
    }

    const checkRes = await fetch(`${sunoApiUrl}/task/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sunoApiKey}`,
      },
    });

    if (!checkRes.ok) {
      const errText = await checkRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: checkRes.status });
    }

    const statusData = await checkRes.json();
    const task = statusData.data || statusData;

    // Détection de l'URL audio si la génération est terminée
    let audioUrl = task.audio_url || task.audio_url_secondary;
    if (Array.isArray(task.clips) && task.clips.length > 0) {
      audioUrl = task.clips[0].audio_url || audioUrl;
    }

    return NextResponse.json({
      success: true,
      status: task.status || (audioUrl ? 'completed' : 'processing'),
      audioUrl: audioUrl,
      title: task.title,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
