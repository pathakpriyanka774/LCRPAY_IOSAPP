// Base URLs
export const BASE_URL = 'https://bbpslcrapi.lcrpay.com';
export const HB_DIGITAL_URL = 'https://api.hbadigitalindia.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Bus related endpoints
  BUSES: `${HB_DIGITAL_URL}/buses`,
  BUS_CHART: `${HB_DIGITAL_URL}/busChart`,
  
  // City related endpoints
  CITIES: `${HB_DIGITAL_URL}/cityList`,
  
  // Aadhar KYC endpoints
  // Add Aadhar KYC specific endpoints here
  
  // User registration endpoints
  // Add user registration endpoints here
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  // Add any other default headers here
};