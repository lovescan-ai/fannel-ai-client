import AES from "crypto-js/aes";
import { enc } from "crypto-js";

const key = process.env.NEXT_PUBLIC_CRYPTO_KEY as string;

export const encrypt = (str: string): string => {
  const cipherText = AES.encrypt(str, key);
  return encodeURIComponent(cipherText.toString());
};

export const decrypt = (str: string): string => {
  const decodedStr = decodeURIComponent(str);
  return AES.decrypt(decodedStr, key).toString(enc.Utf8);
};
