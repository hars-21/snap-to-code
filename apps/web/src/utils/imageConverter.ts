export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export async function processImageFile(file: File) {
  const base64 = await fileToBase64(file);

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    base64,
    lastModified: file.lastModified,
  };
}
