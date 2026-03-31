const STORAGE_KEY = "uploaded_images";

export const getImages = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveImages = (images) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
};

export const addImages = (newImages) => {
  const withDefaults = newImages.map((img) => ({
    ...img,
    favorite: false,
    deleted: false,
  }));
  const existing = getImages();
  const updated = [...withDefaults, ...existing];
  saveImages(updated);
  return updated;
};

export const removeImage = (id) => {
  const existing = getImages();
  const updated = existing.map((img) =>
    img.id === id ? { ...img, deleted: true } : img
  );
  saveImages(updated);
  return updated;
};

export const restoreImage = (id) => {
  const existing = getImages();
  const updated = existing.map((img) =>
    img.id === id ? { ...img, deleted: false } : img
  );
  saveImages(updated);
  return updated;
};

export const permanentDelete = (id) => {
  const existing = getImages();
  const updated = existing.filter((img) => img.id !== id);
  saveImages(updated);
  return updated;
};

export const updateImageName = (id, newName) => {
  const existing = getImages();
  const updated = existing.map((img) =>
    img.id === id ? { ...img, name: newName } : img
  );
  saveImages(updated);
  return updated;
};

export const toggleFavorite = (id) => {
  const existing = getImages();
  const updated = existing.map((img) =>
    img.id === id ? { ...img, favorite: !img.favorite } : img
  );
  saveImages(updated);
  return updated;
};
