
// supabase/functions/_shared/crypto-utils.ts

// Função para derivar uma chave a partir de uma string (o ENCRYPTION_KEY)
async function getKey(secretKey: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secretKey.substring(0, 32)), // AES-GCM usa chaves de 128, 192 ou 256 bits. Pegamos 32 bytes.
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
  return keyMaterial;
}

// Função para criptografar
export async function encrypt(text: string, secretKeyString: string): Promise<string | null> {
  if (!text) return null;
  try {
    const key = await getKey(secretKeyString);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // IV de 96 bits (12 bytes) é recomendado para AES-GCM
    const enc = new TextEncoder();
    const encodedText = enc.encode(text);

    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedText
    );

    // Retorna IV + ciphertext, ambos como strings Base64 concatenadas por um ponto
    // O IV precisa ser salvo junto com o ciphertext para poder descriptografar
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
    return `${ivBase64}.${ciphertextBase64}`;
  } catch (e) {
    console.error("Encryption failed:", e);
    return null;
  }
}

// Função para descriptografar (será usada na função de refresh)
export async function decrypt(encryptedText: string, secretKeyString: string): Promise<string | null> {
  if (!encryptedText) return null;
  try {
    const parts = encryptedText.split('.');
    if (parts.length !== 2) {
      console.error("Invalid encrypted text format for decryption.");
      return null;
    }
    const iv = Uint8Array.from(atob(parts[0]), c => c.charCodeAt(0));
    const data = Uint8Array.from(atob(parts[1]), c => c.charCodeAt(0));
    const key = await getKey(secretKeyString);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
}
