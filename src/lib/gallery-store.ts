const GALLERY_KEY = "chillzone_gallery";

export interface GalleryImage {
  id: string;
  src: string; // base64 data URL
  caption: string;
  addedAt: string;
}

export const getImages = (): GalleryImage[] => {
  try {
    const data = localStorage.getItem(GALLERY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addImage = (src: string, caption: string): GalleryImage => {
  const images = getImages();
  const newImage: GalleryImage = {
    id: crypto.randomUUID(),
    src,
    caption,
    addedAt: new Date().toISOString(),
  };
  images.unshift(newImage);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(images));
  return newImage;
};

export const removeImage = (id: string) => {
  const images = getImages().filter((img) => img.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(images));
};
