/**
 * BHOOMIRAKSHAK River Systems Dataset
 * Nationwide river corridors, Himalayan glacial torrents, and peninsular runoff channels
 */

export const BRAHMAPUTRA_RIVER = {
  name: 'Brahmaputra River',
  color: '#0284c7',
  glowColor: '#38bdf8',
  mainStem: [
    [27.75, 95.80],
    [27.68, 95.62],
    [27.62, 95.42],
    [27.56, 95.25],
    [27.51, 95.08],
    [27.48, 94.94],
    [27.44, 94.78],
    [27.38, 94.60],
    [27.30, 94.40],
    [27.22, 94.22],
    [27.14, 94.02],
    [27.02, 93.80],
    [26.90, 93.60],
    [26.75, 93.30]
  ],
  braidedChannels: [
    [
      [27.54, 95.15],
      [27.49, 94.88],
      [27.42, 94.68],
      [27.34, 94.45],
      [27.26, 94.26],
      [27.18, 94.08]
    ],
    [
      [27.50, 95.22],
      [27.45, 94.98],
      [27.39, 94.75],
      [27.32, 94.50],
      [27.20, 94.28]
    ]
  ],
  tributaries: [
    {
      name: 'Subansiri River',
      path: [
        [27.88, 94.25],
        [27.72, 94.21],
        [27.54, 94.18],
        [27.36, 94.19],
        [27.24, 94.22]
      ]
    },
    {
      name: 'Burhi Dihing River',
      path: [
        [27.22, 95.50],
        [27.26, 95.28],
        [27.34, 95.04],
        [27.44, 94.84]
      ]
    },
    {
      name: 'Siang River',
      path: [
        [28.08, 95.33],
        [27.95, 95.38],
        [27.82, 95.42],
        [27.68, 95.62]
      ]
    },
    {
      name: 'Jiadhal River (Flash Flood prone)',
      path: [
        [27.68, 94.58],
        [27.58, 94.56],
        [27.48, 94.58],
        [27.42, 94.62]
      ]
    }
  ],
  labelPoint: {
    lat: 27.22,
    lng: 94.38,
    name: 'Brahmaputra River',
    rotation: -18
  }
};

export const NATIONWIDE_RIVERS = [
  // 1. Alaknanda - Bhagirathi - Upper Ganga (Uttarakhand)
  {
    name: 'Alaknanda / Ganga River Corridor',
    region: 'Uttarakhand',
    color: '#0ea5e9',
    glowColor: '#38bdf8',
    path: [
      [30.74, 79.49], // Badrinath
      [30.55, 79.56], // Joshimath
      [30.43, 79.43], // Pipalkoti
      [30.33, 79.22], // Karanprayag
      [30.28, 78.98], // Rudraprayag
      [30.15, 78.60], // Devprayag
      [30.08, 78.27], // Rishikesh
      [29.95, 78.16]  // Haridwar
    ],
    label: { lat: 30.28, lng: 78.98, name: 'Alaknanda River Gorge' }
  },
  // 2. Beas River (Himachal Pradesh)
  {
    name: 'Beas River Torrent',
    region: 'Himachal Pradesh',
    color: '#0ea5e9',
    glowColor: '#38bdf8',
    path: [
      [32.36, 77.21], // Rohtang Pass source
      [32.24, 77.19], // Manali
      [31.96, 77.11], // Kullu
      [31.75, 77.21], // Aut gorge
      [31.71, 76.93], // Mandi
      [31.88, 76.25]  // Pong Dam
    ],
    label: { lat: 31.96, lng: 77.11, name: 'Beas River Valley' }
  },
  // 3. Chenab River (Jammu & Kashmir)
  {
    name: 'Chenab River Shear Corridor',
    region: 'Jammu & Kashmir',
    color: '#0ea5e9',
    glowColor: '#38bdf8',
    path: [
      [33.32, 75.76], // Kishtwar
      [33.15, 75.54], // Doda
      [33.24, 75.20], // Ramban
      [33.15, 74.88], // Reasi / Salal
      [32.88, 74.52]  // Akhnoor
    ],
    label: { lat: 33.24, lng: 75.20, name: 'Chenab River Gorge' }
  },
  // 4. Teesta River (Sikkim & West Bengal)
  {
    name: 'Teesta River Torrent',
    region: 'Sikkim / West Bengal',
    color: '#0ea5e9',
    glowColor: '#38bdf8',
    path: [
      [27.70, 88.60], // Chungthang
      [27.50, 88.52], // Mangan
      [27.35, 88.48], // Dikchu
      [27.18, 88.49], // Singtam
      [27.10, 88.50], // Rangpo
      [26.90, 88.43], // Sevoke / Coronation Bridge
      [26.72, 88.62]  // Jalpaiguri
    ],
    label: { lat: 27.18, lng: 88.49, name: 'Teesta River Basin' }
  },
  // 5. Kosi River (Bihar)
  {
    name: 'Kosi River Flood Fan',
    region: 'Bihar',
    color: '#0284c7',
    glowColor: '#38bdf8',
    path: [
      [26.85, 87.15], // Chatra / Nepal border
      [26.50, 86.95], // Supaul
      [26.15, 86.80], // Saharsa
      [25.75, 86.60], // Khagaria
      [25.35, 86.85]  // Confluence with Ganga
    ],
    label: { lat: 26.15, lng: 86.80, name: 'Kosi River Mega-Fan' }
  },
  // 6. Vashishti River (Maharashtra Konkan)
  {
    name: 'Vashishti River Runoff',
    region: 'Maharashtra',
    color: '#0ea5e9',
    glowColor: '#38bdf8',
    path: [
      [17.65, 73.68], // Ghat crest / Koyna spillway
      [17.53, 73.52], // Chiplun town
      [17.55, 73.35], // Anjanvel estuary
      [17.52, 73.18]  // Arabian Sea
    ],
    label: { lat: 17.53, lng: 73.52, name: 'Vashishti River Basin' }
  },
  // 7. Periyar & Chaliyar Rivers (Kerala)
  {
    name: 'Periyar River Gorge',
    region: 'Kerala',
    color: '#0ea5e9',
    glowColor: '#38bdf8',
    path: [
      [9.55, 77.25],  // Periyar Lake
      [9.85, 77.05],  // Idukki Dam
      [10.05, 76.75], // Neriamangalam
      [10.13, 76.45], // Aluva
      [10.18, 76.22]  // Arabian Sea backwaters
    ],
    label: { lat: 9.85, lng: 77.05, name: 'Periyar River Basin' }
  },
  // 8. Mahanadi River Delta (Odisha)
  {
    name: 'Mahanadi River Basin',
    region: 'Odisha',
    color: '#0284c7',
    glowColor: '#38bdf8',
    path: [
      [20.55, 84.85], // Satkosia Gorge
      [20.48, 85.60], // Athagarh
      [20.47, 85.88], // Cuttack Naraj
      [20.30, 86.25], // Jagatsinghpur
      [20.28, 86.68]  // Paradip Port / Bay of Bengal
    ],
    label: { lat: 20.47, lng: 85.88, name: 'Mahanadi River Delta' }
  }
];
