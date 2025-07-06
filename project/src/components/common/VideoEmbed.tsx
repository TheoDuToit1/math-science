import React from 'react';

interface VideoEmbedProps {
  url: string;
  title?: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title }) => {
  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow mb-4">
      <iframe
        src={url}
        title={title || 'Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
      {title && <div className="text-center text-sm text-gray-700 mt-1">{title}</div>}
    </div>
  );
};

export default VideoEmbed; 