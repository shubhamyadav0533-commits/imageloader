import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ImageOff, X, HardDrive } from "lucide-react";
import UploadBox from "../components/UploadBox";
import ImageGrid from "../components/ImageGrid";
import Sidebar from "../components/Sidebar";
import {
  getImages,
  addImages,
  removeImage,
  restoreImage,
  permanentDelete,
  updateImageName,
  toggleFavorite,
} from "../utils/localStorageHelper";

const SECTION_LABELS = {
  all: "All Files",
  files: "My Files",
  recent: "Recent",
  favorites: "Favorites",
  deleted: "Recently Deleted",
};

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [activeSection, setActiveSection] = useState("all");

  useEffect(() => {
    setImages(getImages());
  }, []);

  useEffect(() => {
    if (!previewImage) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") setPreviewImage(null);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [previewImage]);

  const handleUpload = useCallback((newImages) => {
    const updated = addImages(newImages);
    setImages(updated);
  }, []);

  const handleRemove = useCallback((id) => {
    const updated = removeImage(id);
    setImages(updated);
    setPreviewImage((prev) => (prev?.id === id ? null : prev));
  }, []);

  const handleRestore = useCallback((id) => {
    const updated = restoreImage(id);
    setImages(updated);
  }, []);

  const handlePermanentDelete = useCallback((id) => {
    const updated = permanentDelete(id);
    setImages(updated);
    setPreviewImage((prev) => (prev?.id === id ? null : prev));
  }, []);

  const handleRename = useCallback((id, newName) => {
    const updated = updateImageName(id, newName);
    setImages(updated);
  }, []);

  const handleToggleFavorite = useCallback((id) => {
    const updated = toggleFavorite(id);
    setImages(updated);
  }, []);

  const isDeletedView = activeSection === "deleted";

  const sectionImages = useMemo(() => {
    switch (activeSection) {
      case "all":
        return images.filter((img) => !img.deleted);
      case "files":
        return images.filter((img) => !img.deleted);
      case "recent":
        return [...images]
          .filter((img) => !img.deleted)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      case "favorites":
        return images.filter((img) => img.favorite && !img.deleted);
      case "deleted":
        return images.filter((img) => img.deleted);
      default:
        return images.filter((img) => !img.deleted);
    }
  }, [images, activeSection]);

  const filteredImages = useMemo(
    () =>
      sectionImages.filter((image) =>
        image.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sectionImages, searchTerm]
  );

  const activeCount = images.filter((img) => !img.deleted).length;

  return (
    <div className="min-h-screen flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <HardDrive className="w-6 h-6 text-blue-400" />
              <h1 className="text-lg font-semibold text-slate-100">
                {SECTION_LABELS[activeSection]}
              </h1>
              {sectionImages.length > 0 && (
                <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">
                  {sectionImages.length} file
                  {sectionImages.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {sectionImages.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search in Drive"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-56 sm:w-72 rounded-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-800/80 transition-all"
                />
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-6 py-6">
          {!isDeletedView && (
            <UploadBox
              onUpload={handleUpload}
              hasImages={activeCount > 0}
            />
          )}

          {sectionImages.length > 0 ? (
            <div
              className={`${
                !isDeletedView ? "mt-6" : ""
              } bg-slate-800/40 rounded-xl border border-slate-700/60 overflow-hidden`}
            >
              {filteredImages.length > 0 ? (
                <ImageGrid
                  images={filteredImages}
                  onRemove={handleRemove}
                  onRename={handleRename}
                  onPreview={setPreviewImage}
                  onToggleFavorite={handleToggleFavorite}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                  isDeletedView={isDeletedView}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ImageOff className="w-10 h-10 text-slate-600 mb-3" />
                  <p className="text-slate-400 font-medium text-sm">
                    No files found
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    No results for &ldquo;{searchTerm}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ) : (
            !isDeletedView &&
            activeCount > 0 && (
              <div className="mt-6 flex flex-col items-center justify-center py-16 text-center">
                <ImageOff className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 font-medium text-sm">
                  No files in this section
                </p>
              </div>
            )
          )}
        </main>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 z-10 p-2 bg-slate-800 hover:bg-red-500/90 text-white rounded-full shadow-lg border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="w-full h-full object-contain rounded-xl shadow-2xl"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl px-5 py-4">
              <p className="text-white font-medium truncate text-sm">
                {previewImage.name}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {(previewImage.size / 1024 / 1024).toFixed(2)} MB &middot;{" "}
                {previewImage.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;