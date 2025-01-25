export interface Encrypt {
  cipher: Uint8Array;
  key: CryptoKey;
  iv: Uint8Array;
}

async function encrypt(
  text: string,
  iv: Uint8Array,
  key: CryptoKey,
): Promise<Encrypt> {
  try {
    const encodedText: Uint8Array = new TextEncoder().encode(text);

    const cipherText: ArrayBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedText,
    );

    const encryptedArray: Uint8Array = new Uint8Array(cipherText);

    return {
      cipher: encryptedArray,
      key: key,
      iv: iv,
    };
  } catch (err) {
    throw new Error(`Error while encrypting: ${err}`);
  }
}

async function decrypt(
  cipher: Uint8Array,
  iv: Uint8Array,
  key: CryptoKey,
): Promise<string> {
  try {
    const decryptedBuffer: ArrayBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipher,
    );

    const decryptedArray: Uint8Array = new Uint8Array(decryptedBuffer);

    return new TextDecoder().decode(decryptedArray);
  } catch (err) {
    throw new Error(`Error while decrypting: ${err}`);
  }
}

async function deriveRawKey(): Promise<Uint8Array> {
  try {
    const key: CryptoKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );

    const raw: ArrayBuffer = await crypto.subtle.exportKey("raw", key);

    return new Uint8Array(raw);
  } catch (err) {
    throw new Error(`Error while deriving key: ${err}`);
  }
}

async function exportKey(
  destination: string,
): Promise<void> {
  try {
    const rawKey: Uint8Array = await deriveRawKey();
    await Deno.writeFile(destination, rawKey);
  } catch (err) {
    throw new Error(`Error while exporting key: ${err}`);
  }
}

async function importKey(source: string): Promise<CryptoKey> {
  try {
    const rawKey: Uint8Array = await Deno.readFile(source);

    const key: CryptoKey = await crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );

    return key;
  } catch (err) {
    throw new Error(`Error while importing key: ${err}`);
  }
}

export { decrypt, deriveRawKey, encrypt, exportKey, importKey };
