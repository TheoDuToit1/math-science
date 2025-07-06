import React, { useState } from 'react';

interface Activity {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface MythBusterProps {
  myth: string;
  reality?: string;
  truth?: string;
  explanation?: React.ReactNode;
  videoUrl?: string;
  videos?: { url: string; title?: string; thumbnail?: string }[];
  activities?: Activity[];
  onComplete?: () => void;
}

const MythBuster: React.FC<MythBusterProps> = ({ 
  myth, 
  reality, 
  truth, 
  explanation, 
  videoUrl, 
  videos = [], 
  activities = [],
  onComplete
}) => {
  const [activeActivity, setActiveActivity] = useState<number | null>(activities.length > 0 ? 0 : null);
  
  // Support both reality and truth props for backward compatibility
  const realityText = reality || truth || '';
  
  // If videoUrl is provided, convert it to the videos format
  const allVideos = videoUrl 
    ? [{ url: videoUrl, title: 'Learn More' }, ...videos]
    : videos;
  
  return (
    <div className="flex flex-col gap-6">
      {/* Myth vs Reality */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-4">Myth Busted!</h3>
        <div className="mb-4">
          <div className="font-bold text-red-500 mb-1">MYTH:</div>
          <div className="text-lg mb-4">{myth}</div>
          <div className="font-bold text-green-600 mb-1">REALITY:</div>
          <div className="text-lg">{realityText}</div>
        </div>
      </div>
      
      {/* Explanation */}
      {explanation && (
        <div className="mt-2 bg-white p-6 rounded-lg shadow-sm">
          {explanation}
        </div>
      )}
      
      {/* Videos */}
      {allVideos.length > 0 && (
        <div className="mt-2">
          <h3 className="text-lg font-bold mb-4">Watch and Learn</h3>
          <div className="flex flex-row flex-wrap justify-center gap-8 mb-2">
            {allVideos.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                {v.url.endsWith('.mp4') ? (
                  <video controls className="rounded-lg shadow-lg mb-2" width="320">
                    <source src={v.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    src={v.url}
                    title={v.title || `Myth video ${i+1}`}
                    className="rounded-lg shadow-lg mb-2"
                    width="320"
                    height="180"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {v.title && <div className="text-sm font-semibold text-center mt-1">{v.title}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Activities */}
      {activities.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4">Try It Yourself</h3>
          
          {/* Activity tabs */}
          {activities.length > 1 && (
            <div className="flex mb-4 border-b">
              {activities.map((activity, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 font-medium ${
                    activeActivity === index 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                  onClick={() => setActiveActivity(index)}
                >
                  {activity.title}
                </button>
              ))}
            </div>
          )}
          
          {/* Active activity */}
          {activeActivity !== null && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">{activities[activeActivity].title}</h4>
              <p className="text-gray-700 mb-4">{activities[activeActivity].description}</p>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                {activities[activeActivity].content}
              </div>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default MythBuster; 