const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1';

const checkApiEnabled = () => {
  try {
    const saved = localStorage.getItem('vantage_settings');
    if (saved) {
      const prefs = JSON.parse(saved);
      return prefs.liveApiEnabled === true;
    }
  } catch (e) { }
  return false; // Default to false to save credits
};

/**
 * Fetches real-time flight data.
 * @param {number} limit - Maximum number of flights to return.
 * @returns {Promise<Array|null>} Array of flight objects or null if error.
 */
export const fetchLiveFlights = async (limit = 30) => {
  if (!checkApiEnabled()) {
    console.log("Live API is disabled in settings. Using fallback data.");
    return null;
  }

  try {
    if (!API_KEY) {
      console.warn("Aviationstack API key is missing. Using fallback data.");
      return null;
    }
    
    const response = await fetch(`${BASE_URL}/flights?access_key=${API_KEY}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const json = await response.json();
    if (json.error) {
      throw new Error(`API error: ${json.error.message}`);
    }
    
    return json.data;
  } catch (error) {
    console.error("Failed to fetch live flights:", error);
    return null; // Return null so components can fallback to dummy data securely
  }
};

/**
 * Fetches airline information.
 * @param {number} limit - Maximum number of airlines to return.
 */
export const fetchAirlines = async (limit = 10) => {
  if (!checkApiEnabled()) return null;
  
  try {
    if (!API_KEY) return null;
    const response = await fetch(`${BASE_URL}/airlines?access_key=${API_KEY}&limit=${limit}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch airlines:", error);
    return null;
  }
};
