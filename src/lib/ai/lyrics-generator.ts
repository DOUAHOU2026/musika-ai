import { MusicGenreId, SongLanguage } from '@/types';

interface LyricsOptions {
  genre: MusicGenreId;
  topic: string;
  language: SongLanguage;
}

export function generateStructuredLyrics({ genre, topic, language }: LyricsOptions): string {
  const cleanTopic = topic.trim() || 'Célébration et réussite';

  const lyricsThemes: Record<MusicGenreId, { intro: string[]; chorus: string[]; verses: string[]; outro: string[] }> = {
    afrobeat: {
      intro: [
        '(Afrobeat vibe... Horn section rising)',
        'From Lagos to the whole world, listen to the rhythm...',
        'Yeah yeah, let the body move with the groove!',
      ],
      verses: [
        `Underneath the golden sun, we carry the flame\nWorking through the night, never doing it in vain\n${cleanTopic} is on our mind, we lift up the nation\nFeel the heartbeat, pure African dedication.`,
        `Every drum, every kick, tells a story of strength\nWalking this road no matter the length\nBrothers and sisters singing in harmony\nThis melody was made for eternity.`,
      ],
      chorus: [
        `[Refrain]\nOya dance, oya move your body now!\n${cleanTopic}, we making it somehow!\nAfrican sound taking over the stage\nTurning up the fire, turning the page!`,
      ],
      outro: [
        'Saxophone solo fading out...\nMusika AI, pure vibration.\nFela would be proud.',
      ],
    },
    'coupe-decale': {
      intro: [
        '(Animation DJ... Attention la jeunesse !)',
        'Abidjan est doux ! C’est le moment d’enjailler la piste !',
        'Faites du bruit pour la nouvelle danse !',
      ],
      verses: [
        `On a trimé toute la semaine, aujourd’hui c’est le grand jour\n${cleanTopic}, on donne de l’amour\nRegarde la cadence, les pas sont bien calés\nMême les jaloux sont obligés de valider !`,
        `Le coupé-décalé ne peut jamais s’éteindre\nNos rêves sont trop grands pour qu’on vienne nous restreindre\nBouge la tête, lève les mains en l’air\nÀ Abidjan, on sait comment faire !`,
      ],
      chorus: [
        `[Refrain]\nKpakpato décalé ! On avance sans reculer !\n${cleanTopic}, c’est notre moment pour briller !\nDécaler, couper, toujours dans la classe\nMusika prend toute la place !`,
      ],
      outro: [
        'Coup de sifflet final !\nOn est ensemble jusqu’au matin !\nAbidjan validé.',
      ],
    },
    zouglou: {
      intro: [
        '(Tam-tam traditionnel résonne... Guitare acoustique)',
        'Yodé et Siro ont dit : la vie est un combat...',
        'Mais avec la persévérance, on arrive au sommet.',
      ],
      verses: [
        `Dans la vie, faut jamais perdre espoir quand le vent tourne mal\nLa galère d’aujourd’hui prépare l’homme de demain, c’est normal\n${cleanTopic}, on en a fait notre philosophie\nUn pied devant l’autre pour triompher dans la vie.`,
        `Mon frère, regarde autour de toi, la famille compte sur toi\nNe baisse pas les bras devant les épreuves du roi\nDieu ne dort pas, il a déjà tracé ton chemin\nCe que tu sèmes aujourd’hui sera ta récolte de demain.`,
      ],
      chorus: [
        `[Refrain]\nC’est le Zouglou qui libère les cœurs !\nMalgré les larmes, on chante notre bonheur !\n${cleanTopic}, que le son monte au ciel !\nLa vérité pure, fraternelle et essentielle !`,
      ],
      outro: [
        'Agbagnan en acoustique...\nLe Zouglou ne meurt jamais.\nPhilosophie ivoirienne.',
      ],
    },
    amapiano: {
      intro: [
        '(Soft ambient keys... 808 log drum preparing)',
        'Pretoria vibes, sweet and slow...',
        'Feel the frequency deep in your chest.',
      ],
      verses: [
        `Midnight hours on the highway, city lights glow\nBassline kicks in and the heartbeat slows\n${cleanTopic}, spoken softly through the mist\nA frequency that you simply can't resist.`,
        `Piano keys whispering a secret to the crowd\nNothing too harsh, nothing too loud\nJust pure elegance and rhythmic gravity\nAmapiano healing with serenity.`,
      ],
      chorus: [
        `[Chorus]\nBum-bum-ta! Log drums rolling in time\n${cleanTopic}, everything feels sublime\nFrom Soweto to the universe tonight\nWe dancing till the morning light.`,
      ],
      outro: [
        'Reverb keys slowly decaying...\nLog drum heartbeat.\nPure Amapiano.',
      ],
    },
    'rap-ivoirien': {
      intro: [
        '(808 saturée, bruits de sirène au loin)',
        'Wari wari ! Abidjan Nord côté sombre et lumineux !',
        'Nouchi certifié, micro allumé.',
      ],
      verses: [
        `J’arrive sur le beat comme un gbaka sans freins\nDepuis le ghetto, on a su tracer notre chemin\n${cleanTopic}, c’est le mot d’ordre dans la street\nPas le temps pour les bavardages, on veut juste des hits.`,
        `Flow tranchant comme une machette aiguisée\nLes faux frères ont fui dès que le ciel a grondé\nMais on reste debout, fiers et indomptables\nLe rap ivoirien règne désormais à la grande table.`,
      ],
      chorus: [
        `[Refrain]\nAbidjan c’est nous ! Y a rien en face !\n${cleanTopic}, on s’impose et on prend la place !\nTrap nouchi, 808 qui fait trembler le béton\nOn a la recette, on a la vision !`,
      ],
      outro: [
        'Punchline finale réverbérée...\nMusika Studio, flow certifié.',
      ],
    },
    drill: {
      intro: [
        '(Dark cinematic piano melody, hi-hat triplets roll)',
        'Cold streets, high precision.',
        'Bass sliding into position.',
      ],
      verses: [
        `Gliding through the shadows with strategic moves\nNothing left to chance in the pocket of the groove\n${cleanTopic}, written down in my black notebook\nEvery line hits harder than a heavyweight hook.`,
        `They talked a lot of talk, but vanished in the haze\nWe stayed focused on the craft throughout thirty days\nHeavy sliding sub rattles through the floor\nOpening up what was once a closed door.`,
      ],
      chorus: [
        `[Chorus]\nSlide, slide, feel the drill tempo drop!\n${cleanTopic}, we will never ever stop!\nFrom the underground straight to the throne\nMusika rhythm standing all alone.`,
      ],
      outro: [
        'Reverse cymbals... Bass slide decay.',
      ],
    },
    gospel: {
      intro: [
        '(Hammond organ crescendo, soft clapping)',
        'Praise and worship... We give thanks today.',
      ],
      verses: [
        `When the night was dark and hope seemed so far away\nYou guided our footsteps into a brighter day\n${cleanTopic}, a testimony of grace and light\nWe lift our hands with all of our might.`,
        `No mountain too high that faith cannot break\nEvery promise fulfilled for the spirit’s sake\nSinging joyfully with angels in the sky\nOur voices united, our souls flying high.`,
      ],
      chorus: [
        `[Chorus]\nHallelujah, we sing in one accord!\n${cleanTopic}, glory to the Lord!\nLet the joy overflow from soul to soul\nHis love and grace make the broken whole.`,
      ],
      outro: [
        'Powerful choir chord resolution...\nAmen.',
      ],
    },
    rnb: {
      intro: [
        '(Smooth Rhodes chords, finger snaps, silky vocal run)',
        'Yeah... let the music speak tonight.',
      ],
      verses: [
        `Candlelight reflections dancing on the wall\nWaiting for the moment that you make the call\n${cleanTopic}, whispered softly in your ear\nThere is nothing left in this world to fear.`,
        `Harmonies wrapping around like velvet silk\nSweet as honey, smooth as almond milk\nFeel the warmth of every note we share\nPure romance floating through the air.`,
      ],
      chorus: [
        `[Chorus]\nStay with me while the melody plays\n${cleanTopic}, lost inside your gaze\nAfro-R&B rhythm holding us tight\nMaking memories that will outlive the night.`,
      ],
      outro: [
        'Falsetto vocal run fading away...',
      ],
    },
    reggae: {
      intro: [
        '(Roots skank guitar on the offbeat, bass hums)',
        'One love, one people, one destiny...',
      ],
      verses: [
        `Walking down the dusty road with righteousness within\nKnowing that love is where real victories begin\n${cleanTopic}, conscious words for the generation\nSpreading peace and unity across every nation.`,
        `Don't let the noise of the world corrupt your soul\nKeep your inner vision clean, harmonious and whole\nRoots rock reggae playing from the sound system loud\nStanding tall and humble, standing strong and proud.`,
      ],
      chorus: [
        `[Chorus]\nPositive vibrations ringing in the air!\n${cleanTopic}, showing people that we care!\nRoots reggae message never gonna die\nReaching straight from earth up to the sky.`,
      ],
      outro: [
        'Dub echo on the snare... Jah guide.',
      ],
    },
    dancehall: {
      intro: [
        '(Heavy kick and sub-bass explosion)',
        'Selecta ! Drop the wickedest riddim !',
      ],
      verses: [
        `Energy is pumping when we step inside the club\nPure dancehall fever, straight from Kingston to the hub\n${cleanTopic}, moving fast, the crowd is on fire\nTaking the party higher and higher.`,
        `Bass speaker vibration shaking up the floor\nPeople shouting loud, begging for an encore\nSyncopated groove hitting with no delay\nWe dance this riddim till the break of day.`,
      ],
      chorus: [
        `[Chorus]\nWine up, wine up to the heavy sound!\n${cleanTopic}, best energy in town!\nDancehall fever breaking every chain\nFeel the raw adrenaline in your vein!`,
      ],
      outro: [
        'Laser sirens, sub-bass cut.',
      ],
    },
    'hip-hop': {
      intro: [
        '(Vinyl crackle, crisp snare crack)',
        'Boom bap cadence. Real hip hop.',
      ],
      verses: [
        `Pen on the paper, translating every thought\nLessons from the streets that money never bought\n${cleanTopic}, sculpted like a piece of art\nEvery syllable resonating straight from the heart.`,
        `Classic breakbeat looping on the MPC\nRhymes crafted with architectural symmetry\nNo gimmicks, just lyricism raw and bold\nA timeless legacy that never grows old.`,
      ],
      chorus: [
        `[Chorus]\nHead-nod rhythm on the 2 and the 4\n${cleanTopic}, opening the classic door\nReal hip-hop never fades with the trend\nTrue artistic vision to the very end.`,
      ],
      outro: [
        'Vinyl run-out groove pops... Respect.',
      ],
    },
    'traditional-african': {
      intro: [
        '(Son envoûtant de la kora, balafon résonnant)',
        'Paroles des anciens, mémoire des ancêtres...',
      ],
      verses: [
        `Sous le grand baobab, les griots ont parlé\nLes leçons de sagesse que le temps a gardées\n${cleanTopic}, trésor transmis de père en fils\nDans le respect sacré des racines et du calice.`,
        `Le balafon réveille l’écho des collines lointaines\nChassant les peines, soulageant les peines\nLa terre d’Afrique respire à travers ce chant\nÉternel, noble, fier et puissant.`,
      ],
      chorus: [
        `[Refrain]\nÉcoutez le chant des origines et de la paix !\n${cleanTopic}, que notre lumière ne s’éteigne jamais !\nRythmes sacrés, harmonie universelle\nUne mélodie pour l’âme, pure et immortelle.`,
      ],
      outro: [
        'Les cordes de la kora s’apaisent en résonance...',
      ],
    },
  };

  const selected = lyricsThemes[genre] || lyricsThemes.afrobeat;

  return [
    `=== STRUCTURE MUSICALE & PAROLES (GENRE: ${genre.toUpperCase()} | LANGUE: ${language.toUpperCase()}) ===`,
    '',
    '[INTRO]',
    ...selected.intro,
    '',
    '[COUPLET 1]',
    selected.verses[0],
    '',
    ...selected.chorus,
    '',
    '[COUPLET 2]',
    selected.verses[1],
    '',
    ...selected.chorus,
    '',
    '[OUTRO]',
    ...selected.outro,
  ].join('\n');
}

