// Curated quick-add favorite locations across Bulawayo
export interface SuggestedPlace {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

export const suggestedPlaces: SuggestedPlace[] = [
  // Landmarks
  { name: "Bulawayo City Hall", category: "Landmark", latitude: -20.1476, longitude: 28.5806 },
  { name: "Centenary Park", category: "Landmark", latitude: -20.1532, longitude: 28.5847 },
  { name: "Natural History Museum", category: "Landmark", latitude: -20.1539, longitude: 28.5853 },
  { name: "Large City Hall Car Park", category: "Landmark", latitude: -20.1480, longitude: 28.5811 },
  { name: "Mhlahlandlela Government Complex", category: "Landmark", latitude: -20.1502, longitude: 28.5798 },

  // Malls & shopping
  { name: "Bulawayo Centre Mall", category: "Shopping", latitude: -20.1490, longitude: 28.5810 },
  { name: "Fife Street Mall", category: "Shopping", latitude: -20.1491, longitude: 28.5812 },
  { name: "Hyper City Mall", category: "Shopping", latitude: -20.1455, longitude: 28.5836 },
  { name: "Ascot Shopping Centre", category: "Shopping", latitude: -20.1418, longitude: 28.5755 },
  { name: "Hillside Shopping Centre", category: "Shopping", latitude: -20.1648, longitude: 28.6010 },
  { name: "Parkade Centre", category: "Shopping", latitude: -20.1492, longitude: 28.5815 },

  // Transport hubs
  { name: "Bulawayo Railway Station", category: "Transport", latitude: -20.1664, longitude: 28.5818 },
  { name: "Renkini Bus Terminus", category: "Transport", latitude: -20.1571, longitude: 28.5722 },
  { name: "Egodini Terminus", category: "Transport", latitude: -20.1547, longitude: 28.5849 },
  { name: "Joshua Mqabuko Nkomo Airport", category: "Transport", latitude: -20.0173, longitude: 28.6178 },

  // Hospitals & health
  { name: "Mpilo Central Hospital", category: "Health", latitude: -20.1697, longitude: 28.5654 },
  { name: "United Bulawayo Hospitals", category: "Health", latitude: -20.1604, longitude: 28.5781 },
  { name: "Mater Dei Hospital", category: "Health", latitude: -20.1592, longitude: 28.5972 },

  // Hotels
  { name: "Holiday Inn Bulawayo", category: "Hotel", latitude: -20.1486, longitude: 28.5826 },
  { name: "Rainbow Hotel", category: "Hotel", latitude: -20.1486, longitude: 28.5826 },
  { name: "Bulawayo Rainbow Hotel", category: "Hotel", latitude: -20.1494, longitude: 28.5832 },
  { name: "Cresta Churchill Hotel", category: "Hotel", latitude: -20.1820, longitude: 28.5980 },

  // Universities & education
  { name: "NUST Main Campus", category: "Education", latitude: -20.1530, longitude: 28.6486 },
  { name: "Bulawayo Polytechnic", category: "Education", latitude: -20.1611, longitude: 28.5697 },
  { name: "Zimbabwe Open University (BYO)", category: "Education", latitude: -20.1488, longitude: 28.5820 },

  // Tourism / culture
  { name: "Bulawayo Theatre", category: "Tourism", latitude: -20.1506, longitude: 28.5786 },
  { name: "National Art Gallery", category: "Tourism", latitude: -20.1476, longitude: 28.5806 },
  { name: "Bulawayo Public Library", category: "Tourism", latitude: -20.1476, longitude: 28.5806 },
  { name: "Khami Ruins", category: "Tourism", latitude: -20.1467, longitude: 28.4356 },
  { name: "Matobo National Park (entrance)", category: "Tourism", latitude: -20.5497, longitude: 28.5083 },

  // Sports & recreation
  { name: "Barbourfields Stadium", category: "Sports", latitude: -20.1697, longitude: 28.5740 },
  { name: "Queens Sports Club", category: "Sports", latitude: -20.1559, longitude: 28.5847 },
  { name: "Bulawayo Athletic Club", category: "Sports", latitude: -20.1558, longitude: 28.5824 },

  // Government
  { name: "Tredgold Building (Courts)", category: "Government", latitude: -20.1494, longitude: 28.5802 },
  { name: "Bulawayo Magistrates Court", category: "Government", latitude: -20.1498, longitude: 28.5800 },
  { name: "ZIMRA Bulawayo", category: "Government", latitude: -20.1485, longitude: 28.5810 },
];
