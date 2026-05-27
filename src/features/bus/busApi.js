import { API_ENDPOINTS, DEFAULT_HEADERS } from '../../../utils/config';

export function busDataApi(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await fetch(API_ENDPOINTS.BUSES, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        return reject(new Error(`HTTP error! status: ${resp.status}`));
      }

      const result = await resp.json(); // Parse the response body

      resolve(result.data); // Pass resolved data
    } catch (error) {
      console.log(error);
      reject(error); // Handle errors
    }
  });
}

export function busChartApi(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await fetch(API_ENDPOINTS.BUS_CHART, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        return reject(new Error(`HTTP error! status: ${resp.status}`));
      }

      const result = await resp.json(); // Parse the response body

      resolve(result.data); // Pass resolved data
    } catch (error) {
      console.log(error);
      reject(error); // Handle errors
    }
  });
}
