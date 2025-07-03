import { clsx, type ClassValue } from "clsx";
import { adjectives, nouns } from "./const";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateApiKey = (): string => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const random = Math.random().toString(36).substring(2, 10);

  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}`;

  return `sfr-${adj}-${noun}-${random}-${datePart}`;
};

export const formatTime = (date: Date) => {
  return date.toLocaleString();
};
export function openFileInNewTab(fileUrlOrBase64: string, mimeType: string) {
  try {
    const isBase64 =
      /^data:.*;base64,/.test(fileUrlOrBase64) ||
      /^[A-Za-z0-9+/=]+$/.test(fileUrlOrBase64);

    if (isBase64) {
      const base64 = fileUrlOrBase64.includes(",")
        ? fileUrlOrBase64.split(",")[1].trim()
        : fileUrlOrBase64.trim();

      const binaryStr = atob(base64);
      const byteArray = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        byteArray[i] = binaryStr.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } else {
      window.open(fileUrlOrBase64, "_blank");
    }
  } catch (err) {
    console.error("Failed to open file:", err);
    alert("Unable to open file. The format may be invalid.");
  }
}
