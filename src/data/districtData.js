/**
 * BHOOMIRAKSHAK Nationwide District & Regional Geopolitical Boundaries Dataset
 * Administrative labels and district reference points covering all Indian states and hazard sectors
 */

export const DISTRICT_BOUNDARIES = [
  // Arunachal Pradesh - Assam State Boundary (Foothill Line)
  {
    id: 'bnd_arunachal_assam',
    name: 'Arunachal Pradesh - Assam Border',
    type: 'state',
    path: [
      [27.95, 93.85],
      [27.88, 94.12],
      [27.82, 94.38],
      [27.78, 94.65],
      [27.80, 94.92],
      [27.85, 95.15],
      [27.84, 95.42],
      [27.80, 95.72]
    ]
  },
  // Lakhimpur District Boundary
  {
    id: 'bnd_lakhimpur',
    name: 'Lakhimpur District',
    type: 'district',
    path: [
      [27.88, 94.12],
      [27.65, 94.10],
      [27.48, 94.02],
      [27.30, 93.90],
      [27.08, 93.94],
      [27.05, 94.18],
      [27.18, 94.35],
      [27.45, 94.40],
      [27.62, 94.35],
      [27.82, 94.38]
    ]
  },
  // Dhemaji District Boundary
  {
    id: 'bnd_dhemaji',
    name: 'Dhemaji District',
    type: 'district',
    path: [
      [27.82, 94.38],
      [27.62, 94.35],
      [27.45, 94.40],
      [27.38, 94.60],
      [27.44, 94.78],
      [27.52, 95.05],
      [27.65, 95.20],
      [27.85, 95.15],
      [27.80, 94.92],
      [27.78, 94.65]
    ]
  },
  // Dibrugarh District Boundary
  {
    id: 'bnd_dibrugarh',
    name: 'Dibrugarh District',
    type: 'district',
    path: [
      [27.48, 94.94],
      [27.32, 94.82],
      [27.18, 94.98],
      [27.15, 95.18],
      [27.30, 95.32],
      [27.52, 95.18],
      [27.48, 94.94]
    ]
  },
  // Tinsukia District Boundary
  {
    id: 'bnd_tinsukia',
    name: 'Tinsukia District',
    type: 'district',
    path: [
      [27.52, 95.18],
      [27.30, 95.32],
      [27.35, 95.55],
      [27.62, 95.68],
      [27.84, 95.42],
      [27.85, 95.15],
      [27.65, 95.20],
      [27.52, 95.18]
    ]
  }
];

export const DISTRICT_CENTROIDS = [
  // Northwest Himalaya
  { name: 'Shimla', lat: 31.1048, lng: 77.1734, pos: 'top' },
  { name: 'Manali', lat: 32.2396, lng: 77.1887, pos: 'bottom' },
  { name: 'Kullu', lat: 31.9579, lng: 77.1095, pos: 'top' },
  { name: 'Dharamshala', lat: 32.2190, lng: 76.3234, pos: 'top' },
  // Central Himalaya
  { name: 'Joshimath', lat: 30.5506, lng: 79.5660, pos: 'bottom' },
  { name: 'Dehradun', lat: 30.3165, lng: 78.0322, pos: 'top' },
  { name: 'Uttarkashi', lat: 30.7268, lng: 78.4354, pos: 'bottom' },
  { name: 'Rudraprayag', lat: 30.2844, lng: 78.9811, pos: 'top' },
  // J&K & Ladakh
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973, pos: 'top' },
  { name: 'Ramban', lat: 33.2425, lng: 75.1950, pos: 'bottom' },
  { name: 'Kargil', lat: 34.5539, lng: 76.1349, pos: 'top' },
  // Eastern Himalaya & North Bengal
  { name: 'Gangtok', lat: 27.3314, lng: 88.6138, pos: 'top' },
  { name: 'Darjeeling', lat: 27.0410, lng: 88.2663, pos: 'bottom' },
  { name: 'Kalimpong', lat: 27.0667, lng: 88.4667, pos: 'top' },
  // Western Ghats: Maharashtra & Goa
  { name: 'Mahabaleshwar', lat: 17.9237, lng: 73.6586, pos: 'top' },
  { name: 'Chiplun', lat: 17.5323, lng: 73.5186, pos: 'bottom' },
  { name: 'Ratnagiri', lat: 16.9902, lng: 73.3120, pos: 'bottom' },
  { name: 'Panaji', lat: 15.4909, lng: 73.8278, pos: 'top' },
  // Western Ghats: Karnataka, Kerala, Tamil Nadu
  { name: 'Madikeri (Kodagu)', lat: 12.4244, lng: 75.7382, pos: 'top' },
  { name: 'Wayanad', lat: 11.6854, lng: 76.1320, pos: 'bottom' },
  { name: 'Munnar', lat: 10.0889, lng: 77.0595, pos: 'top' },
  { name: 'Ooty (Nilgiris)', lat: 11.4102, lng: 76.6950, pos: 'bottom' },
  // Eastern Ghats & Flood Basins
  { name: 'Araku Valley', lat: 18.3273, lng: 82.8775, pos: 'top' },
  { name: 'Supaul (Kosi)', lat: 26.1260, lng: 86.6050, pos: 'bottom' },
  { name: 'Cuttack', lat: 20.4625, lng: 85.8828, pos: 'bottom' },
  // Northeast
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, pos: 'top' },
  { name: 'Shillong', lat: 25.5788, lng: 91.8933, pos: 'bottom' },
  { name: 'Aizawl', lat: 23.7307, lng: 92.7173, pos: 'top' },
  { name: 'Kohima', lat: 25.6701, lng: 94.1077, pos: 'bottom' },
  { name: 'Imphal', lat: 24.8170, lng: 93.9368, pos: 'top' },
  { name: 'Dhemaji', lat: 27.4800, lng: 94.5800, pos: 'bottom' },
  { name: 'Dibrugarh', lat: 27.4728, lng: 94.9120, pos: 'bottom' },
  { name: 'Tinsukia', lat: 27.5000, lng: 95.3667, pos: 'bottom' },
  { name: 'Pasighat', lat: 28.0667, lng: 95.3333, pos: 'top' }
];

export const REGION_NAMES = [
  { name: 'HIMACHAL PRADESH', lat: 31.85, lng: 77.15, type: 'state' },
  { name: 'UTTARAKHAND', lat: 30.25, lng: 79.15, type: 'state' },
  { name: 'JAMMU & KASHMIR', lat: 33.75, lng: 75.10, type: 'state' },
  { name: 'LADAKH', lat: 34.40, lng: 76.50, type: 'state' },
  { name: 'SIKKIM', lat: 27.60, lng: 88.55, type: 'state' },
  { name: 'NORTH BENGAL', lat: 26.85, lng: 88.35, type: 'state' },
  { name: 'ARUNACHAL PRADESH', lat: 28.15, lng: 94.70, type: 'state' },
  { name: 'ASSAM', lat: 26.35, lng: 92.80, type: 'state' },
  { name: 'MEGHALAYA', lat: 25.50, lng: 91.35, type: 'state' },
  { name: 'NAGALAND', lat: 26.05, lng: 94.45, type: 'state' },
  { name: 'MANIPUR', lat: 24.85, lng: 93.90, type: 'state' },
  { name: 'MIZORAM', lat: 23.35, lng: 92.85, type: 'state' },
  { name: 'TRIPURA', lat: 23.85, lng: 91.80, type: 'state' },
  { name: 'MAHARASHTRA SAHYADRIS', lat: 18.20, lng: 73.60, type: 'state' },
  { name: 'GOA', lat: 15.35, lng: 74.05, type: 'state' },
  { name: 'KARNATAKA MALNAD', lat: 13.50, lng: 75.40, type: 'state' },
  { name: 'KERALA WESTERN GHATS', lat: 10.60, lng: 76.60, type: 'state' },
  { name: 'TAMIL NADU NILGIRIS', lat: 11.35, lng: 76.85, type: 'state' },
  { name: 'ANDHRA EASTERN GHATS', lat: 18.10, lng: 82.70, type: 'state' },
  { name: 'BIHAR KOSI BASIN', lat: 25.90, lng: 86.60, type: 'state' },
  { name: 'ODISHA MAHANADI', lat: 20.40, lng: 85.60, type: 'state' }
];
