import { Business, Coordinates } from '@/types/business';

// Helper function to get coordinates for Bulawayo CBD streets
const getStreetCoordinates = (street: string, avenue: string): { latitude: number; longitude: number } => {
  const baseCoords = { lat: -20.1486, lng: 28.5806 }; // Bulawayo center
  
  // Street offsets (east-west streets)
  const streetOffsets: Record<string, number> = {
    'Jason Moyo St': 0.002,
    'Fort St': 0.001,
    'Fife St': 0.0005,
    'George Silundika St': 0.003,
    'Herbert Chitepo St': 0.0015,
    'Main St': 0.001,
    'Robert Mugabe Way': 0.0025
  };
  
  // Avenue offsets (north-south avenues)
  const avenueOffsets: Record<string, number> = {
    '6th Ave': -0.002,
    '8th Ave': -0.001,
    '9th Ave': 0,
    '10th Ave': 0.001,
    '13th Ave': 0.003
  };
  
  const streetOffset = streetOffsets[street] || 0;
  const avenueOffset = avenueOffsets[avenue] || 0;
  
  return {
    latitude: baseCoords.lat + streetOffset,
    longitude: baseCoords.lng + avenueOffset
  };
};

export const createSampleData = (coordinates: Coordinates, currentCity: string): Business[] => {
  // Only show real Bulawayo businesses for Bulawayo
  if (currentCity !== 'Bulawayo') {
    return [
      {
        id: 1,
        name: "Local Restaurant",
        latitude: coordinates.lat + 0.01,
        longitude: coordinates.lng + 0.01,
        type: "restaurant",
        city: currentCity,
        address: "Main Street"
      },
      {
        id: 2,
        name: "City Museum",
        latitude: coordinates.lat - 0.01,
        longitude: coordinates.lng - 0.01,
        type: "tourism",
        city: currentCity,
        address: "Cultural District"
      }
    ];
  }

  // Real Bulawayo businesses
  return [
    // Banks
    { id: 1, name: "ZB Bank", ...getStreetCoordinates('Jason Moyo St', '8th Ave'), type: "banking", city: currentCity, address: "8th Ave & Jason Moyo St" },
    { id: 2, name: "CBZ Bank", ...getStreetCoordinates('Fort St', '8th Ave'), type: "banking", city: currentCity, address: "8th Ave & Fort St" },
    { id: 3, name: "Stanbic Bank", ...getStreetCoordinates('Jason Moyo St', '9th Ave'), type: "banking", city: currentCity, address: "9th Ave & Jason Moyo St" },
    { id: 4, name: "Steward Bank", ...getStreetCoordinates('Fort St', '10th Ave'), type: "banking", city: currentCity, address: "10th Ave & Fort St" },
    { id: 5, name: "Ecobank", ...getStreetCoordinates('Fife St', '9th Ave'), type: "banking", city: currentCity, address: "9th Ave & Fife St" },
    { id: 6, name: "FBC Bank", ...getStreetCoordinates('Jason Moyo St', '10th Ave'), type: "banking", city: currentCity, address: "10th Ave & Jason Moyo St" },
    { id: 7, name: "POSB", ...getStreetCoordinates('Fort St', '8th Ave'), type: "banking", city: currentCity, address: "8th Ave & Fort St" },
    { id: 8, name: "BancABC", ...getStreetCoordinates('Fort St', '9th Ave'), type: "banking", city: currentCity, address: "9th Ave & Fort St" },
    
    // Insurance & Financial Services
    { id: 9, name: "Old Mutual Zimbabwe", ...getStreetCoordinates('Jason Moyo St', '8th Ave'), type: "business_services", city: currentCity, address: "Old Mutual Centre, 8th Ave & Jason Moyo St" },
    { id: 10, name: "PSMAS", ...getStreetCoordinates('Fort St', '9th Ave'), type: "healthcare", city: currentCity, address: "9th Ave & Fort St" },
    { id: 11, name: "CIMAS", ...getStreetCoordinates('Fort St', '10th Ave'), type: "healthcare", city: currentCity, address: "10th Ave & Fort St" },
    { id: 12, name: "Premier Service Medical Aid", ...getStreetCoordinates('Jason Moyo St', '9th Ave'), type: "healthcare", city: currentCity, address: "9th Ave & Jason Moyo St" },
    
    // Telecommunications
    { id: 13, name: "TelOne", ...getStreetCoordinates('Fife St', '10th Ave'), type: "telecom", city: currentCity, address: "10th Ave & Fife St" },
    { id: 14, name: "Econet Wireless", ...getStreetCoordinates('Fort St', '9th Ave'), type: "telecom", city: currentCity, address: "9th Ave & Fort St" },
    { id: 15, name: "NetOne", ...getStreetCoordinates('Fort St', '8th Ave'), type: "telecom", city: currentCity, address: "8th Ave & Fort St" },
    { id: 16, name: "Liquid Telecom", ...getStreetCoordinates('Fife St', '9th Ave'), type: "telecom", city: currentCity, address: "9th Ave & Fife St" },
    
    // Government Services
    { id: 17, name: "ZIMRA (Bulawayo Office)", ...getStreetCoordinates('Fort St', '9th Ave'), type: "government", city: currentCity, address: "9th Ave & Fort St" },
    { id: 18, name: "National Social Security Authority (NSSA)", ...getStreetCoordinates('Jason Moyo St', '9th Ave'), type: "government", city: currentCity, address: "9th Ave & Jason Moyo St" },
    { id: 19, name: "Zimbabwe Tourism Authority", ...getStreetCoordinates('Fife St', '9th Ave'), type: "government", city: currentCity, address: "9th Ave & Fife St" },
    { id: 20, name: "Bulawayo City Council", latitude: -20.1476, longitude: 28.5806, type: "government", city: currentCity, address: "City Hall, Fife St" },
    { id: 21, name: "Ministry of Labour", ...getStreetCoordinates('Fort St', '9th Ave'), type: "government", city: currentCity, address: "9th Ave & Fort St" },
    { id: 22, name: "Ministry of Education", ...getStreetCoordinates('Fort St', '10th Ave'), type: "government", city: currentCity, address: "10th Ave & Fort St" },
    { id: 23, name: "Ministry of Health", ...getStreetCoordinates('Fort St', '9th Ave'), type: "government", city: currentCity, address: "9th Ave & Fort St" },
    
    // Education
    { id: 24, name: "National University of Science & Technology (NUST)", ...getStreetCoordinates('Fort St', '9th Ave'), type: "education", city: currentCity, address: "9th Ave & Fort St" },
    { id: 25, name: "Zimbabwe Open University", ...getStreetCoordinates('Fort St', '10th Ave'), type: "education", city: currentCity, address: "10th Ave & Fort St" },
    { id: 26, name: "Speciss College", ...getStreetCoordinates('Fort St', '9th Ave'), type: "education", city: currentCity, address: "9th Ave & Fort St" },
    { id: 27, name: "Bulawayo Polytechnic (CBD Annex)", ...getStreetCoordinates('Fort St', '9th Ave'), type: "education", city: currentCity, address: "9th Ave & Fort St" },
    { id: 28, name: "Zimbabwe School Examinations Council (ZIMSEC)", ...getStreetCoordinates('Fort St', '9th Ave'), type: "education", city: currentCity, address: "9th Ave & Fort St" },
    
    // Retail
    { id: 29, name: "Edgars Stores", ...getStreetCoordinates('Jason Moyo St', '8th Ave'), type: "retail", city: currentCity, address: "8th Ave & Jason Moyo St" },
    { id: 30, name: "Truworths", ...getStreetCoordinates('Fort St', '8th Ave'), type: "retail", city: currentCity, address: "8th Ave & Fort St" },
    { id: 31, name: "Jet Stores", ...getStreetCoordinates('Jason Moyo St', '8th Ave'), type: "retail", city: currentCity, address: "8th Ave & Jason Moyo St" },
    { id: 32, name: "Bata Shoe Company", ...getStreetCoordinates('Fort St', '8th Ave'), type: "retail", city: currentCity, address: "8th Ave & Fort St" },
    { id: 33, name: "OK Zimbabwe", latitude: -20.1486, longitude: 28.5806, type: "retail", city: currentCity, address: "Jason Moyo St" },
    { id: 34, name: "TM Pick n Pay", latitude: -20.1476, longitude: 28.5806, type: "retail", city: currentCity, address: "Fort St" },
    { id: 35, name: "Greens Supermarket", ...getStreetCoordinates('Fort St', '9th Ave'), type: "retail", city: currentCity, address: "9th Ave & Fort St" },
    
    // Restaurants & Fast Food
    { id: 36, name: "Chicken Inn", ...getStreetCoordinates('Fort St', '8th Ave'), type: "fast_food", city: currentCity, address: "8th Ave & Fort St" },
    { id: 37, name: "Pizza Inn", ...getStreetCoordinates('Fort St', '8th Ave'), type: "fast_food", city: currentCity, address: "8th Ave & Fort St" },
    { id: 38, name: "Nando's", ...getStreetCoordinates('Jason Moyo St', '8th Ave'), type: "fast_food", city: currentCity, address: "8th Ave & Jason Moyo St" },
    { id: 39, name: "KFC", ...getStreetCoordinates('Fort St', '8th Ave'), type: "fast_food", city: currentCity, address: "8th Ave & Fort St" },
    
    // Hotels & Entertainment
    { id: 40, name: "The Bulawayo Club", latitude: -20.1476, longitude: 28.5806, type: "entertainment", city: currentCity, address: "Fort St" },
    { id: 41, name: "Holiday Inn Bulawayo", latitude: -20.1486, longitude: 28.5826, type: "hotel", city: currentCity, address: "10th Ave" },
    { id: 42, name: "Rainbow Hotel", latitude: -20.1486, longitude: 28.5826, type: "hotel", city: currentCity, address: "10th Ave" },
    { id: 43, name: "Bulawayo Theatre", latitude: -20.1506, longitude: 28.5786, type: "entertainment", city: currentCity, address: "6th Ave" },
    { id: 44, name: "National Art Gallery", latitude: -20.1476, longitude: 28.5806, type: "tourism", city: currentCity, address: "Main St" },
    { id: 45, name: "Bulawayo Public Library", latitude: -20.1476, longitude: 28.5806, type: "tourism", city: currentCity, address: "Fort St" },
    
    // Pharmacies & Healthcare
    { id: 46, name: "Emergency Pharmacy", latitude: -20.1466, longitude: 28.5826, type: "pharmacy", city: currentCity, address: "88 Robert Mugabe Way" },
    { id: 47, name: "Medirite Pharmacy", latitude: -20.1476, longitude: 28.5806, type: "pharmacy", city: currentCity, address: "Fort St" },
    { id: 48, name: "All Saints Children's Hospital", latitude: -20.1486, longitude: 28.5806, type: "healthcare", city: currentCity, address: "CBD" },
    
    // Beauty & Personal Care
    { id: 49, name: "Avroy Shlain Beauty", latitude: -20.1476, longitude: 28.5806, type: "beauty", city: currentCity, address: "Fort St" },
    { id: 50, name: "Inuka Fragrances", latitude: -20.1476, longitude: 28.5806, type: "beauty", city: currentCity, address: "Fort St" },
    { id: 51, name: "Rough Cuts Hair & Beauty", latitude: -20.1476, longitude: 28.5806, type: "beauty", city: currentCity, address: "Fort St" },
    { id: 52, name: "Beauty4Ashes Cosmetics", ...getStreetCoordinates('Jason Moyo St', '8th Ave'), type: "beauty", city: currentCity, address: "Old Mutual Centre" },
    
    // Automotive
    { id: 53, name: "Total Service Station", latitude: -20.1456, longitude: 28.5856, type: "automotive", city: currentCity, address: "Fife St & 13th Ave" },
    { id: 54, name: "Puma Service Station", latitude: -20.1476, longitude: 28.5806, type: "automotive", city: currentCity, address: "Fort St" },
    { id: 55, name: "Zuva Petroleum", ...getStreetCoordinates('Fort St', '8th Ave'), type: "automotive", city: currentCity, address: "8th Ave & Fort St" },
    
    // Business Services
    { id: 56, name: "Zimbabwe National Chamber of Commerce", ...getStreetCoordinates('Fort St', '9th Ave'), type: "business_services", city: currentCity, address: "9th Ave & Fort St" },
    { id: 57, name: "PN&A Chartered Accountants", latitude: -20.1486, longitude: 28.5806, type: "business_services", city: currentCity, address: "CBD" }
  ];
};

export const getMarkerColor = (type: string): string => {
  const colors = {
    'banking': '#1f77b4',
    'telecom': '#ff7f0e', 
    'government': '#2ca02c',
    'education': '#d62728',
    'retail': '#9467bd',
    'healthcare': '#8c564b',
    'restaurant': '#28a745',
    'fast_food': '#ffc107',
    'tourism': '#dc3545',
    'automotive': '#17becf',
    'hotel': '#bcbd22',
    'entertainment': '#e377c2',
    'pharmacy': '#7f7f7f',
    'beauty': '#ff69b4',
    'business_services': '#2e8b57',
    'ngo': '#ff4500'
  };
  return colors[type as keyof typeof colors] || '#007bff';
};