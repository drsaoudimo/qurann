import { Ayah, Reciter, AudioSourceType } from '../types/quran';
import { INITIAL_FATIHA_AYAHS, INITIAL_IKHLAS_AYAHS } from '../data/initialSurahs';

const CACHE_PREFIX = 'quran_surah_v1_';

export function padZero(num: number, size: number = 3): string {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

/**
 * Generates primary and fallback audio URLs for a given ayah
 */
export function getAyahAudioUrls(
  reciter: Reciter,
  surahNumber: number,
  ayahNumberInSurah: number,
  sourceType: AudioSourceType = 'everyayah'
): string[] {
  const surahPadded = padZero(surahNumber, 3);
  const ayahPadded = padZero(ayahNumberInSurah, 3);
  const filename = `${surahPadded}${ayahPadded}.mp3`;

  const everyAyahUrl = `https://everyayah.com/data/${reciter.subfolder}/${filename}`;
  const archiveItemUrl = reciter.archiveIdentifier
    ? `https://archive.org/download/${reciter.archiveIdentifier}/${filename}`
    : `https://archive.org/download/quran-ayah-by-ayah-audio/${reciter.subfolder}/${filename}`;
  const archiveDirectMirror = `https://archive.org/download/quran-everyayah/${reciter.subfolder}/${filename}`;

  if (sourceType === 'archive') {
    return [archiveItemUrl, archiveDirectMirror, everyAyahUrl];
  } else if (sourceType === 'cloud') {
    return [
      everyAyahUrl,
      archiveItemUrl
    ];
  } else {
    // Default 'everyayah' (fastest & most resilient CDN mirrored directly with Archive)
    return [everyAyahUrl, archiveItemUrl, archiveDirectMirror];
  }
}

/**
 * Fetches full surah text, Arabic tafsir (Al-Muyassar), and English translation
 */
export async function fetchSurahAyahs(surahNumber: number): Promise<Ayah[]> {
  // Check memory / preloaded defaults
  if (surahNumber === 1 && INITIAL_FATIHA_AYAHS) {
    return INITIAL_FATIHA_AYAHS;
  }
  if (surahNumber === 112 && INITIAL_IKHLAS_AYAHS) {
    return INITIAL_IKHLAS_AYAHS;
  }

  // Check LocalStorage cache
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${surahNumber}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ar.muyassar,en.sahih`
    );

    if (!response.ok) {
      throw new Error(`Failed to load surah: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.code !== 200 || !json.data || !Array.isArray(json.data)) {
      throw new Error('Invalid Quran API response format');
    }

    const uthmaniEdition = json.data[0];
    const tafsirEdition = json.data[1];
    const translationEdition = json.data[2];

    const ayahs: Ayah[] = uthmaniEdition.ayahs.map((ayahObj: any, index: number) => {
      let text = ayahObj.text;
      // Strip initial Bismillah if not Al-Fatihah, as the UI displays standard Basmala banner at the top of each surah
      if (surahNumber !== 1 && surahNumber !== 9 && index === 0) {
        text = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
      }

      const tafsirObj = tafsirEdition?.ayahs?.[index];
      const transObj = translationEdition?.ayahs?.[index];

      return {
        number: ayahObj.number,
        numberInSurah: ayahObj.numberInSurah,
        text: text.trim(),
        tafsir: tafsirObj?.text || '',
        translation: transObj?.text || '',
        juz: ayahObj.juz,
        page: ayahObj.page,
        sajda: Boolean(ayahObj.sajda)
      };
    });

    // Cache locally
    try {
      localStorage.setItem(`${CACHE_PREFIX}${surahNumber}`, JSON.stringify(ayahs));
    } catch (e) {
      console.warn('LocalStorage save error (quota exceeded):', e);
    }

    return ayahs;
  } catch (err) {
    console.error(`Error loading Surah ${surahNumber}:`, err);
    throw err;
  }
}
