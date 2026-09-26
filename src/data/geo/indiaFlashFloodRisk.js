/**
 * BHOOMIRAKSHAK Nationwide Flash Flood Susceptibility & Risk GeoJSON Polygons
 * Geographically follows river corridors, low-lying drainage basins, and steep catchments across India:
 * 1. Himalayan Valley Torrents (Beas, Sutlej, Alaknanda, Bhagirathi, Teesta)
 * 2. Northeast River Basins (Brahmaputra Floodplains, Subansiri, Jiadhal, Barak)
 * 3. Western Ghats Coastal Runoff Catchments (Kerala Periyar/Pamba, Maharashtra Konkan, Karnataka Netravati)
 * 4. Northern Plains Inundation Corridors (Bihar Kosi, Gandak; UP Ghaghara/Rapti)
 * 5. Eastern River Deltas (Odisha Mahanadi, Baitarani)
 */

export const INDIA_FLASH_FLOOD_GEOJSON = {
  type: "FeatureCollection",
  features: [
    // --- 1. Himachal Pradesh: Beas River Valley ---
    {
      type: "Feature",
      id: "ff-hp-beas-valley",
      properties: {
        id: "ff-hp-beas-valley",
        name: "Beas River Gorge & Kullu Flood Corridor",
        region: "Himachal Pradesh",
        district: "Kullu / Mandi",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 88,
        description: "Steep glaciated catchment with rapid concentration time; vulnerable to cloudburst surges."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.85, 31.60],
          [77.05, 31.85],
          [77.20, 32.25],
          [77.25, 32.20],
          [77.10, 31.80],
          [76.90, 31.55],
          [76.85, 31.60]
        ]]
      }
    },

    // --- 2. Uttarakhand: Alaknanda & Mandakini Corridors ---
    {
      type: "Feature",
      id: "ff-uk-alaknanda-gorge",
      properties: {
        id: "ff-uk-alaknanda-gorge",
        name: "Alaknanda - Mandakini Confluence Valley",
        region: "Uttarakhand",
        district: "Rudraprayag / Chamoli",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 92,
        description: "Extremely steep river gradient; risk of lake outbursts (GLOF/LDOF) and catastrophic surges."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [78.95, 30.25],
          [79.15, 30.55],
          [79.45, 30.55],
          [79.40, 30.35],
          [79.10, 30.20],
          [78.95, 30.25]
        ]]
      }
    },

    // --- 3. Sikkim & North Bengal: Teesta Basin ---
    {
      type: "Feature",
      id: "ff-sk-teesta-basin",
      properties: {
        id: "ff-sk-teesta-basin",
        name: "Teesta River GLOF & Flash Flood Corridor",
        region: "Sikkim / West Bengal",
        district: "Mangan / Pakyong / Jalpaiguri",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 94,
        description: "South Lhonak glacial lake breach path; torrential gorge funneling down to Siliguri plains."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [88.35, 26.80],
          [88.45, 27.25],
          [88.60, 27.70],
          [88.75, 27.65],
          [88.55, 27.15],
          [88.50, 26.75],
          [88.35, 26.80]
        ]]
      }
    },

    // --- 4. Assam: Brahmaputra & Tributary Lowlands ---
    {
      type: "Feature",
      id: "ff-as-dhemaji-jiadhal",
      properties: {
        id: "ff-as-dhemaji-jiadhal",
        name: "Dhemaji - Jiadhal River Flood Basin",
        region: "Assam",
        district: "Dhemaji / Lakhimpur",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 90,
        description: "Flash flood funnel from Arunachal foothills with massive siltation and embankment breaches."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [94.35, 27.35],
          [94.50, 27.65],
          [94.85, 27.60],
          [94.95, 27.40],
          [94.65, 27.30],
          [94.35, 27.35]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ff-as-barak-basin",
      properties: {
        id: "ff-as-barak-basin",
        name: "Barak River Lowland & Silchar Inundation",
        region: "Assam",
        district: "Cachar / Karimganj",
        hazardType: "flash_flood",
        riskLevel: "WARNING",
        baseScore: 82,
        description: "Bowl-shaped topography subject to severe backwater logging during torrential monsoon downpours."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [92.60, 24.70],
          [92.75, 24.95],
          [93.00, 24.90],
          [92.90, 24.65],
          [92.60, 24.70]
        ]]
      }
    },

    // --- 5. Bihar: Kosi & Gandak River Basins ---
    {
      type: "Feature",
      id: "ff-bih-kosi-basin",
      properties: {
        id: "ff-bih-kosi-basin",
        name: "North Bihar Kosi River Flood Fan",
        region: "Bihar",
        district: "Supaul / Saharsa / Madhepura",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 89,
        description: "Sorrow of Bihar; avulsion-prone braided channel network carrying gigantic upstream Himalayan discharge."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [86.50, 25.80],
          [86.70, 26.50],
          [87.10, 26.50],
          [87.00, 25.75],
          [86.50, 25.80]
        ]]
      }
    },

    // --- 6. Eastern Uttar Pradesh: Ghaghara & Rapti Valleys ---
    {
      type: "Feature",
      id: "ff-up-rapti-gorakhpur",
      properties: {
        id: "ff-up-rapti-gorakhpur",
        name: "Gorakhpur - Rapti River Lowland Corridor",
        region: "Uttar Pradesh",
        district: "Gorakhpur / Deoria / Siddharthnagar",
        hazardType: "flash_flood",
        riskLevel: "WARNING",
        baseScore: 76,
        description: "Slow draining alluvial flat with rapid flash influxes from Nepal Mahabharat range."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [82.80, 26.85],
          [83.10, 27.25],
          [83.60, 27.20],
          [83.50, 26.70],
          [82.80, 26.85]
        ]]
      }
    },

    // --- 7. Odisha: Mahanadi Delta & Upper Catchment ---
    {
      type: "Feature",
      id: "ff-od-mahanadi-delta",
      properties: {
        id: "ff-od-mahanadi-delta",
        name: "Mahanadi - Baitarani Coastal Delta Basin",
        region: "Odisha",
        district: "Cuttack / Kendrapara / Jagatsinghpur",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 86,
        description: "High-volume monsoon flood discharge combined with Bay of Bengal cyclonic storm surges."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [85.60, 20.30],
          [85.80, 20.65],
          [86.40, 20.70],
          [86.50, 20.20],
          [85.85, 20.10],
          [85.60, 20.30]
        ]]
      }
    },

    // --- 8. Maharashtra: Konkan Coastal River Systems ---
    {
      type: "Feature",
      id: "ff-mah-vashishti-chiplun",
      properties: {
        id: "ff-mah-vashishti-chiplun",
        name: "Vashishti River Basin & Chiplun Flash Flood Zone",
        region: "Maharashtra",
        district: "Ratnagiri",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 88,
        description: "Steep Western Ghats runoff funneling into tidal estuary; catastrophic urban flash inundations."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [73.30, 17.40],
          [73.45, 17.65],
          [73.65, 17.60],
          [73.55, 17.35],
          [73.30, 17.40]
        ]]
      }
    },

    // --- 9. Karnataka: Netravati & Sharavathi Basins ---
    {
      type: "Feature",
      id: "ff-kar-netravati-basin",
      properties: {
        id: "ff-kar-netravati-basin",
        name: "Netravati River Coastal Catchment",
        region: "Karnataka",
        district: "Dakshina Kannada / Udupi",
        hazardType: "flash_flood",
        riskLevel: "WARNING",
        baseScore: 78,
        description: "High discharge torrents descending from Charmadi Ghat into coastal floodplains."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [74.80, 12.75],
          [75.10, 13.05],
          [75.40, 12.95],
          [75.15, 12.65],
          [74.80, 12.75]
        ]]
      }
    },

    // --- 10. Kerala: Periyar, Pamba & Chaliyar Basins ---
    {
      type: "Feature",
      id: "ff-ker-periyar-basin",
      properties: {
        id: "ff-ker-periyar-basin",
        name: "Periyar River Catchment & Ernakulam Lowlands",
        region: "Kerala",
        district: "Idukki / Ernakulam",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 92,
        description: "Steep Western Ghat reservoir spillways discharging into densely populated coastal lowlands."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.25, 9.95],
          [76.45, 10.25],
          [76.90, 10.15],
          [76.85, 9.85],
          [76.40, 9.80],
          [76.25, 9.95]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ff-ker-wayanad-chaliyar",
      properties: {
        id: "ff-ker-wayanad-chaliyar",
        name: "Chaliyar River Nilambur Flash Flood Plain",
        region: "Kerala",
        district: "Malappuram / Wayanad",
        hazardType: "flash_flood",
        riskLevel: "CRITICAL",
        baseScore: 90,
        description: "Debris torrent and flash flood basin receiving torrential runoff from Wayanad peaks."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.10, 11.20],
          [76.25, 11.45],
          [76.50, 11.40],
          [76.40, 11.15],
          [76.10, 11.20]
        ]]
      }
    }
  ]
};
