// Set this to your deployed Cloudflare Worker URL
const API_BASE = import.meta.env.VITE_GALLERY_API_URL || "";

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  addedAt: string;
}

export const fetchImages = async (): Promise<GalleryImage[]> => {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/images`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.map((img: any) => ({
      id: img.id,
      src: `${API_BASE}${img.url}`,
      caption: img.caption || "",
      addedAt: img.addedAt || "",
    }));
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return [];
  }
};

export const uploadImage = async (
  file: File,
  caption: string,
  token: string
): Promise<GalleryImage | null> => {
  if (!API_BASE) return null;
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    const res = await fetch(`${API_BASE}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return {
      id: data.id,
      src: `${API_BASE}${data.url}`,
      caption: data.caption || "",
      addedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Gallery upload error:", err);
    return null;
  }
};

export const deleteImage = async (id: string, token: string): Promise<boolean> => {
  if (!API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/images/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch (err) {
    console.error("Gallery delete error:", err);
    return false;
  }
};
