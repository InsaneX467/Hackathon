/**
 * BHOOMIRAKSHAK Nationwide Hazard Dataset
 * India-Wide Disaster Early Warning & Hazard Intelligence
 * Geographically distributed entries across 19 states and mountain ranges:
 * Jammu & Kashmir, Ladakh, Himachal Pradesh, Uttarakhand, Sikkim,
 * West Bengal (Darjeeling), Arunachal Pradesh, Assam, Meghalaya, Nagaland,
 * Manipur, Mizoram, Tripura, Maharashtra (Western Ghats), Goa,
 * Karnataka, Kerala, Tamil Nadu (Nilgiris), Andhra Pradesh (Eastern Ghats),
 * and major flash-flood river corridors (Bihar Kosi, Odisha Mahanadi, UP Rapti).
 */

export const NATIONWIDE_HAZARD_POINTS = [
  // ==========================================
  // 1. JAMMU & KASHMIR & LADAKH
  // ==========================================
  {
    id: "ls-jk-ramban",
    hazardType: "landslide",
    region: "Jammu & Kashmir",
    district: "Ramban",
    name: "Ramban - Chenab Shear Zone (NH-44)",
    latitude: 33.2425,
    longitude: 75.1950,
    elevation: 1150,
    slope: 44,
    baseSusceptibility: 88,
    riskScore: 88,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Active Shear Zone • Recurring Rockfall Corridor"
  },
  {
    id: "ls-jk-baramulla",
    hazardType: "landslide",
    region: "Jammu & Kashmir",
    district: "Baramulla",
    name: "Baramulla - Uri Mountain Slopes",
    latitude: 34.1980,
    longitude: 74.3640,
    elevation: 1590,
    slope: 38,
    baseSusceptibility: 76,
    riskScore: 76,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Steep Glaciated Overburden • Rain Induced Mudslide"
  },
  {
    id: "ls-ladakh-kargil",
    hazardType: "landslide",
    region: "Ladakh",
    district: "Kargil",
    name: "Zoji La - Dras High Altitude Pass",
    latitude: 34.2800,
    longitude: 75.7600,
    elevation: 3280,
    slope: 46,
    baseSusceptibility: 82,
    riskScore: 82,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Permafrost Scree Slopes • Snowmelt Debris Flow"
  },

  // ==========================================
  // 2. HIMACHAL PRADESH
  // ==========================================
  {
    id: "ls-hp-kullu-manali",
    hazardType: "landslide",
    region: "Himachal Pradesh",
    district: "Kullu",
    name: "Manali - Solang Valley Slopes",
    latitude: 32.2396,
    longitude: 77.1887,
    elevation: 2050,
    slope: 42,
    baseSusceptibility: 89,
    riskScore: 89,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Torrential Debris Flow Path • High Slope Instability"
  },
  {
    id: "ff-hp-beas-kullu",
    hazardType: "flash_flood",
    region: "Himachal Pradesh",
    district: "Kullu",
    name: "Beas River Basin - Aut Tunnel",
    latitude: 31.7450,
    longitude: 77.2100,
    elevation: 1080,
    slope: 12,
    baseSusceptibility: 88,
    riskScore: 88,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Beas Rapid Surge Corridor • Cloudburst Catchment"
  },
  {
    id: "ls-hp-shimla",
    hazardType: "landslide",
    region: "Himachal Pradesh",
    district: "Shimla",
    name: "Shimla Circular Road Ridge",
    latitude: 31.1048,
    longitude: 77.1734,
    elevation: 2200,
    slope: 36,
    baseSusceptibility: 79,
    riskScore: 79,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Urban Slope Surcharge • Drainage Infiltration Risk"
  },
  {
    id: "ls-hp-kinnaur",
    hazardType: "landslide",
    region: "Himachal Pradesh",
    district: "Kinnaur",
    name: "Nigulsari - Kinnaur NH-5 Cliffs",
    latitude: 31.5400,
    longitude: 78.0200,
    elevation: 2150,
    slope: 48,
    baseSusceptibility: 93,
    riskScore: 93,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Vertical Granitic Rock Fall Zone • Active Slide"
  },
  {
    id: "ls-hp-dharamshala",
    hazardType: "landslide",
    region: "Himachal Pradesh",
    district: "Kangra",
    name: "McLeod Ganj - Dharamshala Escarpment",
    latitude: 32.2426,
    longitude: 76.3213,
    elevation: 1750,
    slope: 39,
    baseSusceptibility: 78,
    riskScore: 78,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "High Orographic Monsoon Influx • Soil Creep"
  },

  // ==========================================
  // 3. UTTARAKHAND
  // ==========================================
  {
    id: "ls-uk-joshimath",
    hazardType: "landslide",
    region: "Uttarakhand",
    district: "Chamoli",
    name: "Joshimath - Ravigram Slopes",
    latitude: 30.5506,
    longitude: 79.5660,
    elevation: 1890,
    slope: 43,
    baseSusceptibility: 95,
    riskScore: 95,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Severe Tectonic Subsidence • MCT Fault Zone"
  },
  {
    id: "ff-uk-chamoli-alaknanda",
    hazardType: "flash_flood",
    region: "Uttarakhand",
    district: "Chamoli",
    name: "Alaknanda - Dhauliganga Confluence",
    latitude: 30.4900,
    longitude: 79.6200,
    elevation: 1420,
    slope: 14,
    baseSusceptibility: 92,
    riskScore: 92,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Glacial Lake Outburst Risk • Torrential Funnel"
  },
  {
    id: "ls-uk-kedarnath",
    hazardType: "landslide",
    region: "Uttarakhand",
    district: "Rudraprayag",
    name: "Kedarnath Valley Moraine Slope",
    latitude: 30.7352,
    longitude: 79.0669,
    elevation: 3580,
    slope: 45,
    baseSusceptibility: 91,
    riskScore: 91,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Glacial Till Debris Slump • Extreme Weather Risk"
  },
  {
    id: "ls-uk-uttarkashi",
    hazardType: "landslide",
    region: "Uttarakhand",
    district: "Uttarkashi",
    name: "Varunavat Parvat - Uttarkashi",
    latitude: 30.7268,
    longitude: 78.4354,
    elevation: 1158,
    slope: 41,
    baseSusceptibility: 84,
    riskScore: 84,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Crown Cracks Observed • Rock Slope Sliding"
  },
  {
    id: "ls-uk-dehradun-mussoorie",
    hazardType: "landslide",
    region: "Uttarakhand",
    district: "Dehradun",
    name: "Mussoorie Bypass Krol Slopes",
    latitude: 30.4598,
    longitude: 78.0644,
    elevation: 2005,
    slope: 35,
    baseSusceptibility: 72,
    riskScore: 72,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Krol Limestone Fissures • Monsoon Road Slips"
  },

  // ==========================================
  // 4. SIKKIM & NORTHERN WEST BENGAL
  // ==========================================
  {
    id: "ls-sk-mangan",
    hazardType: "landslide",
    region: "Sikkim",
    district: "Mangan",
    name: "Mangan - Chungthang Teesta Gorge",
    latitude: 27.5100,
    longitude: 88.5300,
    elevation: 1450,
    slope: 45,
    baseSusceptibility: 94,
    riskScore: 94,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Severe Slope Cutting • Active Seismic Thrust"
  },
  {
    id: "ff-sk-teesta-singtam",
    hazardType: "flash_flood",
    region: "Sikkim",
    district: "Pakyong / Gangtok",
    name: "Singtam - Teesta River Basin",
    latitude: 27.2300,
    longitude: 88.4900,
    elevation: 350,
    slope: 9,
    baseSusceptibility: 93,
    riskScore: 93,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Teesta Dam Overtopping Zone • Extreme Runoff"
  },
  {
    id: "ls-wb-darjeeling",
    hazardType: "landslide",
    region: "West Bengal",
    district: "Darjeeling",
    name: "Paglajhora - Tindharia Sliding Zone",
    latitude: 26.9100,
    longitude: 88.2800,
    elevation: 1850,
    slope: 40,
    baseSusceptibility: 87,
    riskScore: 87,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Deep Regolith Soil Slips • Hill Cart Road Risk"
  },
  {
    id: "ls-wb-kalimpong",
    hazardType: "landslide",
    region: "West Bengal",
    district: "Kalimpong",
    name: "Kalimpong - Teesta Bazar Slopes",
    latitude: 27.0600,
    longitude: 88.4700,
    elevation: 1250,
    slope: 38,
    baseSusceptibility: 81,
    riskScore: 81,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Metamorphic Schist Bedding Failure"
  },

  // ==========================================
  // 5. ARUNACHAL PRADESH
  // ==========================================
  {
    id: "ls-ar-tawang",
    hazardType: "landslide",
    region: "Arunachal Pradesh",
    district: "Tawang",
    name: "Sela Pass - Tawang Ridge Escarpment",
    latitude: 27.5861,
    longitude: 91.8594,
    elevation: 3048,
    slope: 44,
    baseSusceptibility: 83,
    riskScore: 83,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Frost Shattering & Scree Slump"
  },
  {
    id: "ls-ar-subansiri",
    hazardType: "landslide",
    region: "Arunachal Pradesh",
    district: "Lower Subansiri",
    name: "Lower Subansiri Foothill Escarpment",
    latitude: 27.7800,
    longitude: 94.2000,
    elevation: 480,
    slope: 44,
    baseSusceptibility: 93,
    riskScore: 93,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "High Rockfall & Debris Flow Susceptibility"
  },
  {
    id: "ff-ar-pasighat",
    hazardType: "flash_flood",
    region: "Arunachal Pradesh",
    district: "East Siang",
    name: "Siang River Flood Plain - Pasighat",
    latitude: 28.0667,
    longitude: 95.3333,
    elevation: 153,
    slope: 11,
    baseSusceptibility: 85,
    riskScore: 85,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "High Discharge Tsangpo-Siang Transboundary Inflow"
  },

  // ==========================================
  // 6. ASSAM & NORTHEAST HILLS
  // ==========================================
  {
    id: "ff-as-dhemaji",
    hazardType: "flash_flood",
    region: "Assam",
    district: "Dhemaji",
    name: "Dhemaji - Jiadhal River Basin",
    latitude: 27.4816,
    longitude: 94.5828,
    elevation: 104,
    slope: 8,
    baseSusceptibility: 90,
    riskScore: 90,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Brahmaputra Flood Stage Overtopping"
  },
  {
    id: "ls-megh-cherrapunji",
    hazardType: "landslide",
    region: "Meghalaya",
    district: "East Khasi Hills",
    name: "Sohra (Cherrapunji) Southern Escarpment",
    latitude: 25.2833,
    longitude: 91.7333,
    elevation: 1430,
    slope: 46,
    baseSusceptibility: 92,
    riskScore: 92,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Record Rainfall • Sheer Sandstone Cliff Failure"
  },
  {
    id: "ls-mizo-aizawl",
    hazardType: "landslide",
    region: "Mizoram",
    district: "Aizawl",
    name: "Aizawl Khatla Ridge Slopes",
    latitude: 23.7271,
    longitude: 92.7176,
    elevation: 1130,
    slope: 43,
    baseSusceptibility: 82,
    riskScore: 82,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Weak Shale Slices Along Urban Slopes"
  },
  {
    id: "ls-nag-kohima",
    hazardType: "landslide",
    region: "Nagaland",
    district: "Kohima",
    name: "Kohima By-Pass Disoli Ridge",
    latitude: 25.6701,
    longitude: 94.1077,
    elevation: 1440,
    slope: 40,
    baseSusceptibility: 79,
    riskScore: 79,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Disang Shale Structural Instability"
  },
  {
    id: "ls-as-haflong",
    hazardType: "landslide",
    region: "Assam",
    district: "Dima Hasao",
    name: "Haflong Hill Railway Escarpment",
    latitude: 25.1667,
    longitude: 93.0167,
    elevation: 510,
    slope: 42,
    baseSusceptibility: 86,
    riskScore: 86,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Barail Sandstone Sinking Zone"
  },
  {
    id: "ls-man-tupul",
    hazardType: "landslide",
    region: "Manipur",
    district: "Noney",
    name: "Tupul - Noney Railway & Highway Escarpment",
    latitude: 24.7820,
    longitude: 93.6540,
    elevation: 480,
    slope: 44,
    baseSusceptibility: 94,
    riskScore: 94,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    locationRef: "loc_tupul",
    statusText: "Extremely Fragile Debris-Mantle • Active Slump Scarp"
  },
  {
    id: "ls-tri-jampui",
    hazardType: "landslide",
    region: "Tripura",
    district: "North Tripura",
    name: "Jampui Hills Ridge Corridor",
    latitude: 23.9500,
    longitude: 92.2700,
    elevation: 930,
    slope: 36,
    baseSusceptibility: 77,
    riskScore: 77,
    riskLevel: "WARNING",
    type: "susceptibility",
    locationRef: "loc_jampui",
    statusText: "Lateritic Overburden Slope Slump"
  },

  // ==========================================
  // 7. MAHARASHTRA WESTERN GHATS & KONKAN
  // ==========================================
  {
    id: "ls-mah-mahabaleshwar",
    hazardType: "landslide",
    region: "Maharashtra",
    district: "Satara",
    name: "Mahabaleshwar - Pratapgad Ghat Slopes",
    latitude: 17.9237,
    longitude: 73.6586,
    elevation: 1353,
    slope: 45,
    baseSusceptibility: 88,
    riskScore: 88,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "High Monsoonal Influx • Basalt Escarpment Debris"
  },
  {
    id: "ff-mah-chiplun",
    hazardType: "flash_flood",
    region: "Maharashtra",
    district: "Ratnagiri",
    name: "Vashishti River Basin - Chiplun",
    latitude: 17.5323,
    longitude: 73.5186,
    elevation: 18,
    slope: 7,
    baseSusceptibility: 89,
    riskScore: 89,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Tidal Constriction • Sudden Ghat Runoff Flooding"
  },
  {
    id: "ls-mah-lonavala",
    hazardType: "landslide",
    region: "Maharashtra",
    district: "Pune",
    name: "Khandala Ghat - Bhor Ghat Cutting",
    latitude: 18.7557,
    longitude: 73.4091,
    elevation: 620,
    slope: 38,
    baseSusceptibility: 78,
    riskScore: 78,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Heavy Highway Traffic • Loose Overhanging Boulders"
  },
  {
    id: "ls-mah-raigad-mahad",
    hazardType: "landslide",
    region: "Maharashtra",
    district: "Raigad",
    name: "Mahad - Taliye Hill Foot Escarpment",
    latitude: 18.2325,
    longitude: 73.4180,
    elevation: 210,
    slope: 42,
    baseSusceptibility: 90,
    riskScore: 90,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Catastrophic Debris Avalanche Susceptible"
  },

  // ==========================================
  // 8. GOA & KARNATAKA WESTERN GHATS
  // ==========================================
  {
    id: "ls-goa-sattari",
    hazardType: "landslide",
    region: "Goa",
    district: "North Goa",
    name: "Sattari Chorla Ghat Mountain Pass",
    latitude: 15.5800,
    longitude: 74.2200,
    elevation: 740,
    slope: 39,
    baseSusceptibility: 74,
    riskScore: 74,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Lateritic Cap Failure Over Phyllite Base"
  },
  {
    id: "ls-kar-kodagu-madikeri",
    hazardType: "landslide",
    region: "Karnataka",
    district: "Kodagu",
    name: "Madikeri - Jodupala Escarpment",
    latitude: 12.4244,
    longitude: 75.7382,
    elevation: 1150,
    slope: 41,
    baseSusceptibility: 87,
    riskScore: 87,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "High Rainforest Precipitation • Deep Slope Wash"
  },
  {
    id: "ls-kar-chikmagalur",
    hazardType: "landslide",
    region: "Karnataka",
    district: "Chikmagalur",
    name: "Mullayanagiri - Charmadi Ghat Range",
    latitude: 13.3900,
    longitude: 75.7200,
    elevation: 1850,
    slope: 42,
    baseSusceptibility: 83,
    riskScore: 83,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "High Altitude Shola Grassland Slope Disruption"
  },
  {
    id: "ff-kar-netravati",
    hazardType: "flash_flood",
    region: "Karnataka",
    district: "Dakshina Kannada",
    name: "Netravati River Basin - Bantwal",
    latitude: 12.8900,
    longitude: 75.0300,
    elevation: 32,
    slope: 6,
    baseSusceptibility: 80,
    riskScore: 80,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Rapid Coastal Basin Surge From Western Ghats"
  },

  // ==========================================
  // 9. KERALA WESTERN GHATS
  // ==========================================
  {
    id: "ls-ker-wayanad",
    hazardType: "landslide",
    region: "Kerala",
    district: "Wayanad",
    name: "Meppadi - Chooralmala - Mundakkai Ridge",
    latitude: 11.5300,
    longitude: 76.1300,
    elevation: 1250,
    slope: 46,
    baseSusceptibility: 97,
    riskScore: 97,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Extreme Debris Avalanche Vulnerability • Saturated Saprolite"
  },
  {
    id: "ls-ker-munnar",
    hazardType: "landslide",
    region: "Kerala",
    district: "Idukki",
    name: "Munnar - Pettimudi High Range",
    latitude: 10.0889,
    longitude: 77.0595,
    elevation: 1532,
    slope: 43,
    baseSusceptibility: 91,
    riskScore: 91,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "High Tea Estate Slope Shearing • Rainfall Triggered"
  },
  {
    id: "ff-ker-periyar",
    hazardType: "flash_flood",
    region: "Kerala",
    district: "Ernakulam / Idukki",
    name: "Periyar River Basin - Aluva Lowlands",
    latitude: 10.1076,
    longitude: 76.3516,
    elevation: 12,
    slope: 4,
    baseSusceptibility: 91,
    riskScore: 91,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Major Dam Release Backwater Inundation"
  },
  {
    id: "ff-ker-nilambur",
    hazardType: "flash_flood",
    region: "Kerala",
    district: "Malappuram",
    name: "Chaliyar River Basin - Nilambur",
    latitude: 11.2764,
    longitude: 76.2244,
    elevation: 45,
    slope: 8,
    baseSusceptibility: 86,
    riskScore: 86,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Torrential Debris Flood Confluence"
  },

  // ==========================================
  // 10. TAMIL NADU NILGIRIS & WESTERN GHATS
  // ==========================================
  {
    id: "ls-tn-ooty",
    hazardType: "landslide",
    region: "Tamil Nadu",
    district: "Nilgiris",
    name: "Ooty - Doddabetta Plateau Slopes",
    latitude: 11.4102,
    longitude: 76.6950,
    elevation: 2240,
    slope: 39,
    baseSusceptibility: 85,
    riskScore: 85,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Deep Red Ferralitic Soils Prone to Monsoon Slips"
  },
  {
    id: "ls-tn-kodaikanal",
    hazardType: "landslide",
    region: "Tamil Nadu",
    district: "Dindigul",
    name: "Palani Hills - Kodaikanal Ghat Section",
    latitude: 10.2381,
    longitude: 77.4892,
    elevation: 2133,
    slope: 38,
    baseSusceptibility: 77,
    riskScore: 77,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Rockfall and Soil Slumps Along Mountain Highways"
  },

  // ==========================================
  // 11. ANDHRA PRADESH EASTERN GHATS
  // ==========================================
  {
    id: "ls-ap-araku",
    hazardType: "landslide",
    region: "Andhra Pradesh",
    district: "Alluri Sitharama Raju",
    name: "Araku Valley - Borra Caves Escarpment",
    latitude: 18.2800,
    longitude: 83.0500,
    elevation: 910,
    slope: 34,
    baseSusceptibility: 65,
    riskScore: 65,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Khondalite Weathering & Cyclonic Flash Slip"
  },

  // ==========================================
  // 12. GANGETIC & EASTERN FLOODPLAINS
  // ==========================================
  {
    id: "ff-bih-kosi",
    hazardType: "flash_flood",
    region: "Bihar",
    district: "Supaul",
    name: "Kosi River Embankment Corridor - Birpur",
    latitude: 26.5200,
    longitude: 87.0100,
    elevation: 68,
    slope: 3,
    baseSusceptibility: 90,
    riskScore: 90,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "Rapid Avulsion & Upstream Nepal Inundation"
  },
  {
    id: "ff-od-mahanadi",
    hazardType: "flash_flood",
    region: "Odisha",
    district: "Cuttack",
    name: "Mahanadi Delta - Cuttack Ring Road",
    latitude: 20.4625,
    longitude: 85.8828,
    elevation: 36,
    slope: 3,
    baseSusceptibility: 87,
    riskScore: 87,
    riskLevel: "CRITICAL",
    type: "susceptibility",
    statusText: "High Discharge Hirakud Outflow & Deltaic Surge"
  },
  {
    id: "ff-up-rapti",
    hazardType: "flash_flood",
    region: "Uttar Pradesh",
    district: "Gorakhpur",
    name: "Rapti - Rohini Confluence Plain",
    latitude: 26.7606,
    longitude: 83.3732,
    elevation: 84,
    slope: 2,
    baseSusceptibility: 78,
    riskScore: 78,
    riskLevel: "WARNING",
    type: "susceptibility",
    statusText: "Backwater Waterlogging & Embankment Pressure"
  }
];

// Macro Regional Belts for nationwide high-level zoom (Zoom <= 6)
export const INDIA_MACRO_REGIONAL_BELTS = [
  {
    id: "macro-nw-himalaya",
    name: "Northwest Himalayan Belt (J&K, HP, Ladakh)",
    hazardType: "landslide",
    riskLevel: "CRITICAL",
    score: 90,
    coordinates: [
      [74.0, 32.5],
      [74.5, 34.8],
      [77.8, 33.2],
      [78.8, 31.8],
      [77.0, 31.0],
      [75.0, 32.2],
      [74.0, 32.5]
    ]
  },
  {
    id: "macro-central-himalaya",
    name: "Central Himalayan Belt (Uttarakhand Garhwal & Kumaon)",
    hazardType: "landslide",
    riskLevel: "CRITICAL",
    score: 93,
    coordinates: [
      [78.0, 30.2],
      [78.6, 31.2],
      [80.5, 30.5],
      [80.8, 29.5],
      [79.5, 29.2],
      [78.5, 29.8],
      [78.0, 30.2]
    ]
  },
  {
    id: "macro-eastern-himalaya",
    name: "Eastern Himalayan Belt (Sikkim & Darjeeling Hills)",
    hazardType: "landslide",
    riskLevel: "CRITICAL",
    score: 91,
    coordinates: [
      [88.0, 26.8],
      [88.1, 27.8],
      [88.9, 27.8],
      [88.8, 26.8],
      [88.0, 26.8]
    ]
  },
  {
    id: "macro-northeast-belt",
    name: "Northeast Hills & Brahmaputra Basin",
    hazardType: "mixed",
    riskLevel: "CRITICAL",
    score: 92,
    coordinates: [
      [91.5, 25.0],
      [92.0, 28.0],
      [96.0, 28.5],
      [95.5, 24.0],
      [93.0, 23.5],
      [91.5, 25.0]
    ]
  },
  {
    id: "macro-north-western-ghats",
    name: "Northern Western Ghats (Maharashtra & Goa Sahyadris)",
    hazardType: "landslide",
    riskLevel: "CRITICAL",
    score: 87,
    coordinates: [
      [73.1, 15.5],
      [73.3, 19.5],
      [74.0, 19.5],
      [74.3, 15.5],
      [73.1, 15.5]
    ]
  },
  {
    id: "macro-south-western-ghats",
    name: "Southern Western Ghats (Karnataka, Kerala & Nilgiris)",
    hazardType: "mixed",
    riskLevel: "CRITICAL",
    score: 95,
    coordinates: [
      [75.0, 11.0],
      [74.8, 14.5],
      [75.8, 14.2],
      [77.2, 11.5],
      [77.4, 9.5],
      [76.5, 9.2],
      [75.0, 11.0]
    ]
  },
  {
    id: "macro-eastern-ghats",
    name: "Eastern Ghats Belt (Andhra Pradesh & Odisha)",
    hazardType: "landslide",
    riskLevel: "WATCH",
    score: 62,
    coordinates: [
      [82.5, 17.5],
      [83.0, 19.0],
      [84.5, 19.5],
      [83.8, 17.8],
      [82.5, 17.5]
    ]
  },
  {
    id: "macro-bihar-plains",
    name: "North Bihar Kosi Flood Fan",
    hazardType: "flash_flood",
    riskLevel: "CRITICAL",
    score: 89,
    coordinates: [
      [85.5, 25.5],
      [86.0, 26.8],
      [87.5, 26.8],
      [87.2, 25.5],
      [85.5, 25.5]
    ]
  }
];

/**
 * Returns comprehensive aggregated summary of hazard regions across India
 */
export function getIndiaHazardOverview() {
  const byRegion = {};

  for (const h of NATIONWIDE_HAZARD_POINTS) {
    if (!byRegion[h.region]) {
      byRegion[h.region] = {
        region: h.region,
        totalPoints: 0,
        criticalCount: 0,
        warningCount: 0,
        watchCount: 0,
        hazardTypes: new Set(),
        maxScore: 0
      };
    }
    const r = byRegion[h.region];
    r.totalPoints++;
    if (h.riskLevel === 'CRITICAL') r.criticalCount++;
    else if (h.riskLevel === 'WARNING') r.warningCount++;
    else if (h.riskLevel === 'WATCH') r.watchCount++;

    r.hazardTypes.add(h.hazardType);
    if (h.riskScore > r.maxScore) r.maxScore = h.riskScore;
  }

  return Object.values(byRegion).map(r => ({
    ...r,
    hazardTypes: Array.from(r.hazardTypes)
  }));
}

/**
 * Dynamic weather effect:
 * Modifies base model susceptibility score based on live precipitation / rainfall factor
 */
export function calculateDynamicHazardScore(baseScore, rainfallMm = 0) {
  let rainfallFactor = 0;
  if (rainfallMm > 25) rainfallFactor = 16;
  else if (rainfallMm > 15) rainfallFactor = 10;
  else if (rainfallMm > 5) rainfallFactor = 5;
  else if (rainfallMm > 0.5) rainfallFactor = 2;

  const finalScore = Math.min(100, Math.max(10, baseScore + rainfallFactor));
  let level = 'LOW';
  if (finalScore >= 80) level = 'CRITICAL';
  else if (finalScore >= 60) level = 'WARNING';
  else if (finalScore >= 40) level = 'WATCH';

  return {
    baseSusceptibility: baseScore,
    rainfallFactor,
    finalScore,
    riskLevel: level
  };
}
