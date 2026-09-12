export const generateKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

export const encryptData = async (data: any, key: CryptoKey): Promise<{ encryptedBuffer: ArrayBuffer, iv: Uint8Array }> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData
  );
  return { encryptedBuffer, iv };
};

export const decryptData = async (encryptedBuffer: ArrayBuffer, iv: Uint8Array, key: CryptoKey): Promise<any> => {
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as any,
    },
    key,
    encryptedBuffer
  );
  const decodedData = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decodedData);
};
