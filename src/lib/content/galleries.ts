export type GalleryMeta = {
  slug: string;
  label: string;
  subtitle?: string;
  desc?: string;
  /** folder name under public/assets/images/ */
  folder: string;
  altPrefix: string;
};

export type ProcessionsHubCard = {
  slug: string;
  title: string[];
  location: string;
  coverThumb: string;
  coverAlt: string;
};

/**
 * The 12 galleries the legacy CMS could publish to, plus the 4 processions
 * sub-galleries (structurally identical masonry pages, just not part of the
 * CMS's auto-publish registry). Intro copy is verbatim from the legacy HTML.
 */
export const GALLERIES: GalleryMeta[] = [
  {
    slug: "portraits",
    label: "Portraits",
    subtitle: "Ritratti in bianco e nero",
    desc: "Volti e presenze: luce modellata su lineamenti e mani, sguardi diretti e attimi intimi. Ogni scatto cerca la personalità oltre la posa, nel dialogo tra contrasto e morbidezza del bianco e nero.",
    folder: "photo-portraits",
    altPrefix: "Ritratto",
  },
  {
    slug: "street",
    label: "Street",
    subtitle: "Fotografia di strada",
    desc: "Attimi rubati alla vita urbana. Gesti, sguardi e situazioni che raccontano la città e chi la abita, senza pose né filtri.",
    folder: "photo-street",
    altPrefix: "Street",
  },
  {
    slug: "jazz",
    label: "Jazz",
    subtitle: "Musica e ritratti sul palco",
    desc: "I grandi nomi del jazz colti durante concerti e session. Luci di scena, strumenti e espressioni che raccontano la passione e l'energia della musica dal vivo.",
    folder: "photo-jazz",
    altPrefix: "Jazz",
  },
  {
    slug: "arti-mestieri",
    label: "Arti e mestieri",
    desc: "«Siamo tutti apprendisti in un mestiere dove non si diventa mai maestri.» — Ernest Hemingway",
    folder: "photo-arti-mestieri",
    altPrefix: "Arti e mestieri",
  },
  {
    slug: "fulvio-vellone",
    label: "Fulvio Vellone",
    subtitle: "Artista",
    desc: "«L'argilla prende forma, la luce modella il tempo..»",
    folder: "photo-fulvio-vellone",
    altPrefix: "Fulvio Vellone",
  },
  {
    slug: "country-market",
    label: "Country market",
    subtitle: "Mercati",
    desc: "Il mercato è un caleidoscopio di storie. Non fotografi la merce, ma la vita che pulsa tra i banchi: volti, espressioni e gesti che raccontano la tradizione.",
    folder: "photo-country-market",
    altPrefix: "Country market",
  },
  {
    slug: "giochi-di-paese",
    label: "Giochi di paese",
    subtitle: "La cuccagna",
    desc: "Mani piene di grasso, muscoli tesi nello sforzo e gli occhi al cielo:\nla cuccagna è la fatica più dolce del paese.\nSalire insieme, scivolare da soli, ma con il paese intero a spingerti con lo sguardo.\nLa fotografia ne racconta la fatica e la felicità della conquista.",
    folder: "photo-giochi-di-paese",
    altPrefix: "Giochi di paese",
  },
  {
    slug: "windows",
    label: "Windows",
    subtitle: "Geometrie e riflessi",
    desc: "Vetrate e riquadri trasformano la strada in composizioni quasi astratte: riflessi sovrapposti, luci filtrate e stratificazioni dietro il vetro, tra geometria urbana e frammenti di vita accennata.",
    folder: "photo-windows",
    altPrefix: "Windows",
  },
  {
    slug: "urban",
    label: "Urban",
    subtitle: "Architetture e paesaggi urbani",
    desc: "Fatti di luce e di ombre, altre con elementi umani che ne completano la scena",
    folder: "photo-urban",
    altPrefix: "Urban",
  },
  {
    slug: "train",
    label: "Train",
    subtitle: "Viaggio e racconti in movimento",
    desc: "Una serie fotografica dedicata ai treni, agli interni, ai volti incontrati e ai paesaggi osservati dal finestrino: frammenti di viaggio che raccontano attese, partenze e piccoli dettagli quotidiani lungo il percorso.",
    folder: "photo-train",
    altPrefix: "Train",
  },
  {
    slug: "auschwitz",
    label: "Auschwitz",
    subtitle: "Memoria e testimonianza",
    desc: "Luoghi della Shoah in bianco e nero: silenzi, geometrie del campo, cieli compresi tra filo spinato e orizzonti vuoti. Immagini pensate per restituire il peso della storia e invitare alla riflessione.",
    folder: "photo-auschwitz",
    altPrefix: "Auschwitz",
  },
  {
    slug: "colours",
    label: "Colours",
    subtitle: "Luce, cielo e cromie",
    desc: "Un percorso nel colore: sfumature del cielo, contrasti delicati e atmosfere luminose. Immagini che esplorano la forza espressiva della tavolozza cromatica, tra orizzonti aperti e dettagli che restituiscono intensità visiva al paesaggio.",
    folder: "photo-colours",
    altPrefix: "Colours",
  },
  {
    slug: "landscapes",
    label: "Landscapes",
    subtitle: "Paesaggi e orizzonti",
    desc: "Mare, montagne e cieli drammatici. Immagini che raccontano il rapporto tra l'uomo e la natura, tra vastità e dettagli.",
    folder: "photo-landscapes",
    altPrefix: "Landscapes",
  },
  {
    slug: "cascano",
    label: "Festa e Processione \"San Giuseppe\"",
    folder: "photo-processions/photogallery-cascano",
    altPrefix: "Cascano",
  },
  {
    slug: "guardia",
    label: "Riti Settennali",
    folder: "photo-processions/photogallery-guardia",
    altPrefix: "Guardia",
  },
  {
    slug: "sessa",
    label: "Settimana Santa",
    folder: "photo-processions/photogallery-sessa",
    altPrefix: "Sessa",
  },
  {
    slug: "troia",
    label: "Processione delle Catene",
    folder: "photo-processions/photogallery-troia",
    altPrefix: "Troia",
  },
];

export const PROCESSIONS_SUB_SLUGS = ["cascano", "guardia", "sessa", "troia"];

export const PROCESSIONS_HUB: {
  title: string;
  subtitle: string;
  desc: string;
  cards: ProcessionsHubCard[];
} = {
  title: "Processions",
  subtitle: "Processioni, cortei e celebrazioni di comunità",
  desc: "Un percorso visivo tra riti che occupano la strada: comitive in movimento, attese affollate e attimi solenni. Le immagini restituiscono il carattere pubblico della devozione e delle feste radicate, dove il corpo sociale si riconosce nel gesto ripetuto e condiviso.",
  cards: [
    {
      slug: "troia",
      title: ['"Processione delle Catene"'],
      location: "Troia (FG)",
      coverThumb: "photo-processions/photogallery-troia/thumbs/21.webp",
      coverAlt: "Processione delle Catene, Troia",
    },
    {
      slug: "guardia",
      title: ['"Riti Settennali"'],
      location: "Guardia Sanframondi (BN)",
      coverThumb: "photo-processions/photogallery-guardia/thumbs/15.webp",
      coverAlt: "Riti Settennali, Guardia Sanframondi",
    },
    {
      slug: "sessa",
      title: ["Settimana Santa"],
      location: "Sessa Aurunca (CE)",
      coverThumb: "photo-processions/photogallery-sessa/thumbs/014.webp",
      coverAlt: "Settimana Santa, Sessa Aurunca",
    },
    {
      slug: "cascano",
      title: ["Festa e Processione", '"San Giuseppe"'],
      location: "Cascano di Sessa A. (CE)",
      coverThumb: "photo-processions/photogallery-cascano/thumbs/35.webp",
      coverAlt: "Festa e Processione San Giuseppe, Cascano",
    },
  ],
};

export function getGallery(slug: string): GalleryMeta | undefined {
  return GALLERIES.find((g) => g.slug === slug);
}
