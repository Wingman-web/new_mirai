import { useState, useEffect } from 'react';

export default function VideoPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if preloader has been shown in this session
    const hasSeenPreloader = sessionStorage.getItem('preloaderShown');
    
    if (hasSeenPreloader) {
      setIsLoading(false);
    }
  }, []);

  const handleVideoEnd = () => {
    // Start fade out animation
    setFadeOut(true);
    
    // After fade out completes, hide preloader
    setTimeout(() => {
      sessionStorage.setItem('preloaderShown', 'true');
      setIsLoading(false);
    }, 500);
  };

  const handleSkip = () => {
    handleVideoEnd();
  };

  if (!isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px' }}>Welcome to the Homepage</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          The preloader has been shown. Refresh the page to see it again.
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem('preloaderShown');
            window.location.reload();
          }}
          style={{
            padding: '12px 24px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reset & Show Preloader Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.5s ease-out'
        }}
      >
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        >
          <source 
            src="https://d3p1hokpi6aqc3.cloudfront.net/preloader.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            zIndex: 10000
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Skip →
        </button>

        {/* Loading indicator (optional) */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            color: 'white',
            fontSize: '14px',
            opacity: 0.7
          }}
        >
          Loading...
        </div>
      </div>
    </>
  );
}
