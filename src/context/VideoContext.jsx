import { createContext, useContext, useState, useCallback } from 'react';

const VideoContext = createContext(null);

export function VideoProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);   // { title, category, ... }
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const [fullscreenContainerRef, setFullscreenContainerRef] = useState(null);

  const startWatching = useCallback((video, studentFlag) => {
    setCurrentVideo(video);
    setIsWatching(true);
    setIsStudent(studentFlag);
  }, []);

  const stopWatching = useCallback(() => {
    setIsWatching(false);
    setCurrentVideo(null);
  }, []);

  return (
    <VideoContext.Provider value={{
      currentVideo,
      isFullscreen,
      setIsFullscreen,
      isWatching,
      isStudent,
      startWatching,
      stopWatching,
      fullscreenContainerRef,
      setFullscreenContainerRef,
    }}>
      {children}
    </VideoContext.Provider>
  );
}

export const useVideo = () => useContext(VideoContext);
