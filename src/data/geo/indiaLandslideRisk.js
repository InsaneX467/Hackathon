/**
 * BHOOMIRAKSHAK Nationwide Landslide Susceptibility & Risk GeoJSON Polygons
 * Geographically follows mountainous, hilly, and high-slope escarpments across India:
 * 1. Northwest Himalaya (J&K, Ladakh, Himachal Pradesh)
 * 2. Central Himalaya (Uttarakhand Garhwal & Kumaon)
 * 3. Eastern Himalaya (Sikkim & Northern West Bengal / Darjeeling)
 * 4. Arunachal Pradesh Mountain Fronts
 * 5. Northeast Hill Tracts (Meghalaya Plateau, Naga Hills, Mizo Hills, Dima Hasao)
 * 6. Northern Western Ghats (Maharashtra Sahyadris & Konkan Escarpment)
 * 7. Central Western Ghats (Goa & Karnataka Malnad)
 * 8. Southern Western Ghats (Kerala Wayanad, Idukki, Munnar, Nilgiris / Tamil Nadu)
 * 9. Eastern Ghats (Andhra Pradesh Araku / Papikonda)
 */

export const INDIA_LANDSLIDE_GEOJSON = {
  type: "FeatureCollection",
  features: [
    // --- 1. Jammu & Kashmir: Pir Panjal & Chenab Valley Escarpment ---
    {
      type: "Feature",
      id: "ls-jk-pirpanjal",
      properties: {
        id: "ls-jk-pirpanjal",
        name: "Jammu-Srinagar Highway & Chenab Valley Corridor",
        region: "Jammu & Kashmir",
        district: "Ramban / Udhampur / Doda",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 88,
        description: "Extremely active shear zones, shattered sedimentary formations, and active slope failures along NH-44."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [74.90, 33.15],
          [75.15, 33.25],
          [75.45, 33.20],
          [75.60, 33.05],
          [75.35, 32.90],
          [75.05, 32.98],
          [74.90, 33.15]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-jk-kashmir-valley-rim",
      properties: {
        id: "ls-jk-kashmir-valley-rim",
        name: "North Kashmir Foothills & Baramulla Escarpment",
        region: "Jammu & Kashmir",
        district: "Baramulla / Kupwara",
        hazardType: "landslide",
        riskLevel: "WARNING",
        baseScore: 74,
        description: "Steep slopes prone to mudslides and snow-melt induced debris flow."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [74.10, 34.15],
          [74.40, 34.35],
          [74.55, 34.20],
          [74.35, 34.05],
          [74.10, 34.15]
        ]]
      }
    },

    // --- 2. Himachal Pradesh: Beas, Sutlej & Parvati Valleys ---
    {
      type: "Feature",
      id: "ls-hp-kullu-manali",
      properties: {
        id: "ls-hp-kullu-manali",
        name: "Kullu-Manali Valley & Rohtang Escarpment",
        region: "Himachal Pradesh",
        district: "Kullu",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 89,
        description: "Steep glaciated gorges, loose scree deposits, and flash debris flows triggered by cloudbursts."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.05, 31.85],
          [77.20, 32.25],
          [77.35, 32.40],
          [77.45, 32.20],
          [77.30, 31.80],
          [77.05, 31.85]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-hp-shimla-kinnaur",
      properties: {
        id: "ls-hp-shimla-kinnaur",
        name: "Shimla-Kinnaur Sutlej River Corridor (NH-5)",
        region: "Himachal Pradesh",
        district: "Kinnaur / Shimla",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 92,
        description: "High-grade metamorphic vertical rock walls prone to catastrophic rockfalls and cliff collapses."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.50, 31.40],
          [78.00, 31.65],
          [78.45, 31.75],
          [78.50, 31.50],
          [77.90, 31.30],
          [77.50, 31.40]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-hp-dharamshala-kangra",
      properties: {
        id: "ls-hp-dharamshala-kangra",
        name: "Dhauladhar Ridge & Dharamshala Escarpment",
        region: "Himachal Pradesh",
        district: "Kangra / Mandi",
        hazardType: "landslide",
        riskLevel: "WARNING",
        baseScore: 78,
        description: "Intense monsoonal orographic precipitation against steep Dhauladhar granite cliffs."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.20, 32.15],
          [76.45, 32.35],
          [76.90, 32.10],
          [76.80, 31.85],
          [76.35, 32.00],
          [76.20, 32.15]
        ]]
      }
    },

    // --- 3. Uttarakhand: Garhwal & Kumaon Himalayas ---
    {
      type: "Feature",
      id: "ls-uk-chamoli-joshimath",
      properties: {
        id: "ls-uk-chamoli-joshimath",
        name: "Joshimath - Alaknanda Valley Escarpment",
        region: "Uttarakhand",
        district: "Chamoli",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 94,
        description: "Main Central Thrust (MCT) shear zone, active ground subsidence, and slope toe-erosion."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.35, 30.35],
          [79.55, 30.65],
          [79.80, 30.60],
          [79.75, 30.35],
          [79.45, 30.25],
          [79.35, 30.35]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-uk-kedarnath-rudraprayag",
      properties: {
        id: "ls-uk-kedarnath-rudraprayag",
        name: "Mandakini Valley & Kedarnath Basin",
        region: "Uttarakhand",
        district: "Rudraprayag",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 91,
        description: "Glacial moraine debris fields vulnerable to high-intensity cloudburst remobilization."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [78.95, 30.40],
          [79.05, 30.75],
          [79.25, 30.70],
          [79.15, 30.35],
          [78.95, 30.40]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-uk-uttarkashi-bhagirathi",
      properties: {
        id: "ls-uk-uttarkashi-bhagirathi",
        name: "Bhagirathi Gorge & Uttarkashi Slopes",
        region: "Uttarakhand",
        district: "Uttarkashi",
        hazardType: "landslide",
        riskLevel: "WARNING",
        baseScore: 79,
        description: "Steep metamorphic phyllite slopes with joint fissures along the Gangotri corridor."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [78.25, 30.65],
          [78.50, 30.90],
          [78.75, 30.80],
          [78.45, 30.55],
          [78.25, 30.65]
        ]]
      }
    },

    // --- 4. Sikkim & Northern West Bengal ---
    {
      type: "Feature",
      id: "ls-sk-mangan-gangtok",
      properties: {
        id: "ls-sk-mangan-gangtok",
        name: "North Sikkim Teesta Gorge & Mangan Ridge",
        region: "Sikkim",
        district: "Mangan / Gangtok",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 93,
        description: "Young crystalline tectonic zone susceptible to massive landslides triggered by seismic events and monsoonal downpours."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [88.40, 27.25],
          [88.50, 27.60],
          [88.70, 27.55],
          [88.65, 27.25],
          [88.40, 27.25]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-wb-darjeeling-hills",
      properties: {
        id: "ls-wb-darjeeling-hills",
        name: "Darjeeling - Kalimpong Himalayan Ridge",
        region: "West Bengal",
        district: "Darjeeling / Kalimpong",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 86,
        description: "Deeply weathered soil mantles on steep tea-garden slopes; Paglajhora and Tindharia active slide areas."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [88.15, 26.85],
          [88.25, 27.15],
          [88.55, 27.15],
          [88.45, 26.85],
          [88.15, 26.85]
        ]]
      }
    },

    // --- 5. Arunachal Pradesh ---
    {
      type: "Feature",
      id: "ls-ar-tawang-kameng",
      properties: {
        id: "ls-ar-tawang-kameng",
        name: "Tawang & West Kameng High Ridge Corridor",
        region: "Arunachal Pradesh",
        district: "Tawang / West Kameng",
        hazardType: "landslide",
        riskLevel: "WARNING",
        baseScore: 79,
        description: "High altitude Sela Pass permafrost degradation and high mountain slope slippage."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [91.80, 27.45],
          [92.15, 27.75],
          [92.40, 27.50],
          [92.10, 27.25],
          [91.80, 27.45]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-ar-subansiri-foothills",
      properties: {
        id: "ls-ar-subansiri-foothills",
        name: "Lower Subansiri & Siang Escarpment",
        region: "Arunachal Pradesh",
        district: "Lower Subansiri / East Siang",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 90,
        description: "Dense rainforest escarpments with steep gorges and high seismotectonic activity."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [93.80, 27.60],
          [94.35, 28.00],
          [95.20, 28.15],
          [95.10, 27.75],
          [94.10, 27.45],
          [93.80, 27.60]
        ]]
      }
    },

    // --- 6. Northeast Hills (Meghalaya, Mizoram, Nagaland) ---
    {
      type: "Feature",
      id: "ls-megh-sohra-plateau",
      properties: {
        id: "ls-megh-sohra-plateau",
        name: "Cherrapunji - Mawsynram Southern Escarpment",
        region: "Meghalaya",
        district: "East Khasi Hills",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 92,
        description: "World's highest monsoonal rainfall on sheer sandstone and limestone cliffs overlooking Bangladesh plains."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [91.45, 25.15],
          [91.60, 25.35],
          [91.95, 25.35],
          [91.85, 25.10],
          [91.45, 25.15]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-mizo-aizawl-ridge",
      properties: {
        id: "ls-mizo-aizawl-ridge",
        name: "Aizawl Urban Anticline & Slope Corridor",
        region: "Mizoram",
        district: "Aizawl",
        hazardType: "landslide",
        riskLevel: "WARNING",
        baseScore: 78,
        description: "Incompetent shale beds dipping parallel to steep urban hill slopes."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [92.65, 23.65],
          [92.75, 23.85],
          [92.90, 23.80],
          [92.80, 23.60],
          [92.65, 23.65]
        ]]
      }
    },

    // --- 7. Maharashtra Western Ghats & Konkan ---
    {
      type: "Feature",
      id: "ls-mah-mahabaleshwar-ghats",
      properties: {
        id: "ls-mah-mahabaleshwar-ghats",
        name: "Mahabaleshwar - Raigad Sahyadri Ridge",
        region: "Maharashtra",
        district: "Satara / Raigad / Ratnagiri",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 87,
        description: "Basaltic Deccan trap scarps with deep lateritic clay layers subject to massive debris avalanches during monsoon downpours."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [73.40, 17.65],
          [73.55, 18.15],
          [73.75, 18.00],
          [73.65, 17.50],
          [73.40, 17.65]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-mah-pune-lonavala",
      properties: {
        id: "ls-mah-pune-lonavala",
        name: "Khandala - Lonavala Ghat Section (Mumbai-Pune Corridor)",
        region: "Maharashtra",
        district: "Pune / Raigad",
        hazardType: "landslide",
        riskLevel: "WARNING",
        baseScore: 76,
        description: "Vertical cuts along expressway corridor with frequent boulders and rockfall risks."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [73.25, 18.65],
          [73.40, 18.85],
          [73.55, 18.80],
          [73.45, 18.60],
          [73.25, 18.65]
        ]]
      }
    },

    // --- 8. Karnataka Western Ghats ---
    {
      type: "Feature",
      id: "ls-kar-kodagu-coorg",
      properties: {
        id: "ls-kar-kodagu-coorg",
        name: "Kodagu (Coorg) - Brahmagiri Ridge",
        region: "Karnataka",
        district: "Kodagu / Hassan",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 86,
        description: "Steep coffee plantation slopes with saturated lithomargic clay beds prone to sudden debris flows."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.60, 12.20],
          [75.75, 12.60],
          [75.95, 12.50],
          [75.80, 12.10],
          [75.60, 12.20]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-kar-agumbe-uttarakannada",
      properties: {
        id: "ls-kar-agumbe-uttarakannada",
        name: "Agumbe Rainforest Ghat & Western Slopes",
        region: "Karnataka",
        district: "Shimoga / Udupi / Uttara Kannada",
        hazardType: "landslide",
        riskLevel: "WARNING",
        baseScore: 75,
        description: "High rainfall tropical ghat pass with intense run-off saturation."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [74.85, 13.40],
          [75.05, 13.70],
          [75.20, 13.60],
          [75.05, 13.35],
          [74.85, 13.40]
        ]]
      }
    },

    // --- 9. Kerala Western Ghats ---
    {
      type: "Feature",
      id: "ls-ker-wayanad-chooralmala",
      properties: {
        id: "ls-ker-wayanad-chooralmala",
        name: "Wayanad Vellarimala - Chooralmala Ridge",
        region: "Kerala",
        district: "Wayanad / Kozhikode",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 96,
        description: "Severe debris avalanche risk zone; highly saturated charnockite saprolite formations on steep rainforest slopes."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.05, 11.40],
          [76.15, 11.70],
          [76.35, 11.65],
          [76.25, 11.35],
          [76.05, 11.40]
        ]]
      }
    },
    {
      type: "Feature",
      id: "ls-ker-idukki-munnar",
      properties: {
        id: "ls-ker-idukki-munnar",
        name: "Munnar - Idukki High Range Slopes",
        region: "Kerala",
        district: "Idukki",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 88,
        description: "High-altitude tea estate slopes with active slope displacement along Pettimudi and Gap Road fault sectors."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.90, 9.85],
          [77.05, 10.20],
          [77.25, 10.15],
          [77.15, 9.80],
          [76.90, 9.85]
        ]]
      }
    },

    // --- 10. Tamil Nadu Nilgiris ---
    {
      type: "Feature",
      id: "ls-tn-nilgiris-ooty",
      properties: {
        id: "ls-tn-nilgiris-ooty",
        name: "Nilgiris High Plateau & Coonoor Slopes",
        region: "Tamil Nadu",
        district: "Nilgiris",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 85,
        description: "Intensely weathered deep residual soils on steep mountain tea slopes; prone to slips during northeast monsoon."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.60, 11.30],
          [76.75, 11.55],
          [76.95, 11.45],
          [76.85, 11.20],
          [76.60, 11.30]
        ]]
      }
    },

    // --- 11. Andhra Pradesh Eastern Ghats ---
    {
      type: "Feature",
      id: "ls-ap-araku-valley",
      properties: {
        id: "ls-ap-araku-valley",
        name: "Araku Valley - Ananthagiri Hills",
        region: "Andhra Pradesh",
        district: "Alluri Sitharama Raju / Visakhapatnam",
        hazardType: "landslide",
        riskLevel: "WATCH",
        baseScore: 58,
        description: "Eastern Ghats khondalite hills prone to rockslides during cyclonic cloud bursts."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [82.85, 18.15],
          [83.05, 18.40],
          [83.25, 18.25],
          [83.05, 18.05],
          [82.85, 18.15]
        ]]
      }
    },

    // --- 12. Manipur: Tupul & Noney Mountain Corridor ---
    {
      type: "Feature",
      id: "ls-man-tupul-noney",
      properties: {
        id: "ls-man-tupul-noney",
        name: "Tupul - Noney Railway & NH-37 Escarpment",
        region: "Manipur",
        district: "Noney",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 94,
        description: "Severely deformed Disang shale with active debris slump zones affecting infrastructure."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [93.55, 24.70],
          [93.62, 24.85],
          [93.75, 24.82],
          [93.70, 24.68],
          [93.55, 24.70]
        ]]
      }
    },

    // --- 13. Tripura: Jampui Hills Ridge ---
    {
      type: "Feature",
      id: "ls-tri-jampui-ridge",
      properties: {
        id: "ls-tri-jampui-ridge",
        name: "Jampui Hills Ridge Slope",
        region: "Tripura",
        district: "North Tripura",
        hazardType: "landslide",
        riskLevel: "WARNING",
        baseScore: 75,
        description: "North-south trending anticline ridge with weathered sandstone susceptible to slope failures."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [92.20, 23.85],
          [92.25, 24.05],
          [92.35, 24.00],
          [92.30, 23.80],
          [92.20, 23.85]
        ]]
      }
    },

    // --- 14. Assam: Dima Hasao / Haflong Hill Tract ---
    {
      type: "Feature",
      id: "ls-as-haflong-barail",
      properties: {
        id: "ls-as-haflong-barail",
        name: "Haflong - Barail Mountain Range Escarpment",
        region: "Assam",
        district: "Dima Hasao",
        hazardType: "landslide",
        riskLevel: "CRITICAL",
        baseScore: 86,
        description: "Barail sandstone and shale complex prone to deep-seated rotational slides and hill railway cut subsidence."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [92.90, 25.10],
          [93.00, 25.25],
          [93.18, 25.20],
          [93.12, 25.05],
          [92.90, 25.10]
        ]]
      }
    }
  ]
};
