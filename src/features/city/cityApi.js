import { API_ENDPOINTS, DEFAULT_HEADERS } from '../../../utils/config';

export function allCities() {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await fetch(API_ENDPOINTS.CITIES, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
      });

      if (!resp.ok) {
        return reject(new Error(`HTTP error! status: ${resp.status}`));
      }

      const result = await resp.json(); // Parse the response body as JSON
      console.log(result);
      resolve(result.data); // Resolve the promise with the JSON data
    } catch (error) {
      reject(error); // Reject the promise if there was an error
    }
  });
}
