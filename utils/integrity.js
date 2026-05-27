import { Buffer } from "buffer";

// Only replace + and /, keep padding '='
function toBase64WebSafe(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")   // + → -
    .replace(/\//g, "_");  // / → _
}

async function generateSecureNonce() {
  const bytes = new Uint8Array(16);
  // Use global crypto.getRandomValues which should be set up by polyfills.js
  if (typeof global.crypto !== 'undefined' && global.crypto.getRandomValues) {
    global.crypto.getRandomValues(bytes);
  } else {
    // Fallback if crypto is not available
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const nonce = toBase64WebSafe(Buffer.from(bytes));
  console.log("Nonce (web-safe):", nonce);
  return nonce;
}

export async function getIntegrityToken() {
  const nonce = await generateSecureNonce();
  
  // Check if IntegrityModule exists (native module)
  if (typeof IntegrityModule !== 'undefined' && IntegrityModule.getIntegrityToken) {
    const token = await IntegrityModule.getIntegrityToken(nonce);
    return { token, nonce };
  } else {
    // Fallback if IntegrityModule is not available
    console.warn('IntegrityModule not found, using fallback token');
    const fallbackToken = 'fallback-token-' + Date.now();
    return { token: fallbackToken, nonce };
  }
}


// import { getIntegrityToken } from "../utils/integrity";

// async function secureLogin() {
//   const { token, nonce } = await getIntegrityToken();

//   await api.post("/security/verify-integrity", {
//     integrity_token: token,
//     nonce,
//   });

//   // Continue login only if backend returns OK
// }







// import { getIntegrityToken } from "../utils/integrity";
// import api from "../utils/api"; // your axios wrapper

// export async function secureLogin(phone, password) {
//   const { token, nonce } = await getIntegrityToken();

//   const res = await api.post("/security/verify-integrity", {
//     integrity_token: token,
//     nonce,
//     phone,
//     password
//   });

//   return res.data;
// }




// import { getIntegrityToken } from "../utils/integrity";
// import api from "../utils/api"; // axios instance

// export async function secureLogin(payload) {
//   const { token, nonce } = await getIntegrityToken();

//   const res = await api.post("/security/verify-integrity", {
//     integrity_token: token,
//     nonce,
//   });

//   if (!res.data.allowed) {
//     throw new Error("Device / app failed integrity: " + res.data.reason);
//   }

//   // proceed with normal login (OTP, password, etc.)
// }
