export interface SkiResort {
  id: string;
  name: string;
  kanji: string;
  region: string;
  lat: number;
  lng: number;
  website: string;
  difficulty: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

export const SKI_RESORTS: SkiResort[] = [
  {
    id: "niseko-united",
    name: "Niseko United",
    kanji: "ニセコユナイテッド",
    region: "Hokkaido",
    lat: 42.8647,
    lng: 140.7027,
    website: "https://www.niseko.ne.jp/en/",
    difficulty: { beginner: 30, intermediate: 40, advanced: 30 }
  },
  {
    id: "hakuba-happo-one",
    name: "Hakuba Happo-one",
    kanji: "白馬八方尾根",
    region: "Nagano",
    lat: 36.7027,
    lng: 137.8286,
    website: "https://www.happo-one.jp/en/",
    difficulty: { beginner: 30, intermediate: 50, advanced: 20 }
  },
  {
    id: "rusutsu",
    name: "Rusutsu Resort",
    kanji: "ルスツリゾート",
    region: "Hokkaido",
    lat: 42.7483,
    lng: 140.8988,
    website: "https://rusutsu.com/en/",
    difficulty: { beginner: 30, intermediate: 40, advanced: 30 }
  },
  {
    id: "shiga-kogen",
    name: "Shiga Kogen",
    kanji: "志賀高原",
    region: "Nagano",
    lat: 36.7262,
    lng: 138.5085,
    website: "https://www.shigakogen.gr.jp/english/",
    difficulty: { beginner: 50, intermediate: 35, advanced: 15 }
  },
  {
    id: "nozawa-onsen",
    name: "Nozawa Onsen",
    kanji: "野沢温泉",
    region: "Nagano",
    lat: 36.9242,
    lng: 138.4526,
    website: "https://en.nozawaski.com/",
    difficulty: { beginner: 40, intermediate: 30, advanced: 30 }
  },
  {
    id: "furano",
    name: "Furano Ski Resort",
    kanji: "富良野スキー場",
    region: "Hokkaido",
    lat: 43.3267,
    lng: 142.3484,
    website: "https://www.princehotels.com/en/ski/furano/",
    difficulty: { beginner: 40, intermediate: 40, advanced: 20 }
  },
  {
    id: "tomamu",
    name: "Hoshino Resorts Tomamu",
    kanji: "星野リゾート トマム",
    region: "Hokkaido",
    lat: 43.0617,
    lng: 142.6322,
    website: "https://www.snowtomamu.jp/winter/en/",
    difficulty: { beginner: 30, intermediate: 40, advanced: 30 }
  },
  {
    id: "zao-onsen",
    name: "Zao Onsen",
    kanji: "蔵王温泉",
    region: "Yamagata",
    lat: 38.1643,
    lng: 140.3951,
    website: "https://www.zao-spa.or.jp/english/",
    difficulty: { beginner: 40, intermediate: 40, advanced: 20 }
  },
  {
    id: "myoko-kogen",
    name: "Myoko Kogen",
    kanji: "妙高高原",
    region: "Niigata",
    lat: 36.8828,
    lng: 138.1969,
    website: "https://myokokogen.net/",
    difficulty: { beginner: 45, intermediate: 35, advanced: 20 }
  },
  {
    id: "naeba",
    name: "Naeba",
    kanji: "苗場",
    region: "Niigata",
    lat: 36.7933,
    lng: 138.7844,
    website: "https://www.princehotels.com/en/ski/naeba/",
    difficulty: { beginner: 30, intermediate: 40, advanced: 30 }
  },
  {
    id: "iwappara",
    name: "Iwappara",
    kanji: "岩原滑雪場",
    region: "Niigata",
    lat: 36.9333,
    lng: 138.8333,
    website: "https://www.iwa-para.com/",
    difficulty: { beginner: 60, intermediate: 30, advanced: 10 }
  }
];
