export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const MAX_IMAGE_DIMENSION = 200;

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImage = (file: File): ImageValidationResult => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Only JPG, JPEG and PNG files are allowed",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "File size must be less than 5MB",
    };
  }

  return { isValid: true };
};

export const resizeImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_IMAGE_DIMENSION) {
          height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
          width = MAX_IMAGE_DIMENSION;
        } else if (height > MAX_IMAGE_DIMENSION) {
          width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
          height = MAX_IMAGE_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to blob and create new file
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to resize image"));
            }
          },
          file.type,
          0.8
        ); // 0.8 quality maintains good balance between size and quality
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
  });
};
