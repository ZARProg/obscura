"use client";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey: string | null;
}

export default function TrailerModal({
  isOpen,
  onClose,
  trailerKey,
}: TrailerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 rounded-full px-3 py-1 text-white"
        >
          ✕
        </button>
        {trailerKey ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Trailer tidak tersedia
          </div>
        )}
      </div>
    </div>
  );
}
