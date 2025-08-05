import axios from "axios";
import SongCard from "./SongCard";
import * as faceapi from "face-api.js";
import WebcamModal from "./WebcamModal";
import { Bars } from "react-loader-spinner";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { Button, Box, Paper, Grid, Typography, Container, Chip } from "@mui/material";
import { keyframes } from "@emotion/react";

var geolocation = require("geolocation");

// Animated background gradient
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Floating animation for cards
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Pulse animation for buttons
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Glow effect
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 69, 255, 0.5); }
  50% { box-shadow: 0 0 40px rgba(139, 69, 255, 0.8), 0 0 60px rgba(255, 20, 147, 0.4); }
`;

const MainContainer = styled('div')({
  minHeight: '100vh',
  background: 'linear-gradient(-45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
  backgroundSize: '400% 400%',
  animation: `${gradientShift} 15s ease infinite`,
  padding: '20px 0',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  }
});

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  padding: '30px',
  margin: '20px 0',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  animation: `${float} 6s ease-in-out infinite`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  }
}));

const EmotionButton = styled(Button)(({ emotion }) => {
  const emotionColors = {
    Happy: 'linear-gradient(135deg, #FFD700, #FFA500)',
    Sad: 'linear-gradient(135deg, #4682B4, #1E90FF)',
    Surprised: 'linear-gradient(135deg, #FF69B4, #FF1493)',
    Fearful: 'linear-gradient(135deg, #9370DB, #8A2BE2)',
    Angry: 'linear-gradient(135deg, #FF4500, #DC143C)',
    Disgusted: 'linear-gradient(135deg, #32CD32, #228B22)',
    Neutral: 'linear-gradient(135deg, #808080, #696969)',
  };

  return {
    background: emotionColors[emotion] || 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: '20px',
    minWidth: '80px',
    minHeight: '80px',
    fontSize: '30px',
    margin: '10px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      transform: 'translateY(-5px) scale(1.1)',
      animation: `${pulse} 1s infinite`,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },
    '&:active': {
      transform: 'translateY(-2px) scale(1.05)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      transition: 'left 0.5s',
    },
    '&:hover::before': {
      left: '100%',
    }
  };
});

const ActionButton = styled(Button)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '25px',
  padding: '15px 40px',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    transform: 'translateY(-3px)',
    animation: `${glow} 2s infinite`,
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.6)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.6s',
  },
  '&:hover::before': {
    left: '100%',
  }
});

const StyledChip = styled(Chip)({
  background: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  fontSize: '16px',
  padding: '5px',
  margin: '5px',
  '& .MuiChip-icon': {
    color: 'white',
  }
});

const SongGrid = styled(Grid)({
  '& .MuiGrid-item': {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  }
});

const LoaderContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '50px',
  '& .loader-text': {
    color: 'white',
    fontSize: '18px',
    marginTop: '20px',
    animation: `${pulse} 2s infinite`,
  }
});

function MainComponent() {
  const [loader, setShowLoader] = useState(false);
  const [songs, setSongs] = useState([]);
  const [showSongs, setShowSongs] = useState(false);

  const [webcamModal, setWebcamModal] = useState(false);
  const [emotion, setEmotion] = useState();
  const [weather, setWeather] = useState();
  const [location, setLocation] = useState();
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    };
    !modelsLoaded && loadModels();

    !location &&
      geolocation.getCurrentPosition(function (err, position) {
        if (err) throw err;
        setLocation(position.coords.latitude + "," + position.coords.longitude);
      });

    location &&
      axios
        .get(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&aqi=no`
        )
        .then((response) => {
          setWeather(response.data.current.condition.text);
        })
        .catch((error) => {
          console.error("Weather API error:", error);
        });
  }, [location]);

  useEffect(() => {
    emotion && recommendSongs(emotion);
  }, [emotion]);

  const recommendSongs = (mood) => {
    setEmotion(mood);
    setShowLoader(true);
    setShowSongs(true);

    // Try multiple approaches to get songs
    // First try with a simpler search term
    const searchTerm = weather ? `${mood} ${weather}` : mood;
    
    console.log("Searching for:", searchTerm);

    // Updated Shazam API configuration
    const options = {
      method: "GET",
      url: "https://shazam.p.rapidapi.com/search",
      params: {
        term: searchTerm,
        locale: "en-US",
        offset: "0",
        limit: "10",
      },
      headers: {
        "X-RapidAPI-Host": "shazam.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.REACT_APP_MUSIC_API_KEY,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("Full API Response:", response);
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
        
        setShowLoader(false);
        
        // Check for different possible response structures
        if (response.data && response.data.tracks && response.data.tracks.hits && response.data.tracks.hits.length > 0) {
          console.log("Found songs in tracks.hits");
          setSongs(response.data.tracks.hits);
        } else if (response.data && response.data.hits && response.data.hits.length > 0) {
          console.log("Found songs in hits");
          setSongs(response.data.hits);
        } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log("Found songs in array");
          setSongs(response.data);
        } else {
          console.warn("No songs found or unexpected response structure");
          console.log("Trying fallback approach...");
          
          // Fallback: Try with just the mood
          tryFallbackSearch(mood);
        }
      })
      .catch(function (error) {
        setShowLoader(false);
        console.error("Shazam API error:", error);
        
        if (error.response) {
          console.error("Error Status:", error.response.status);
          console.error("Error Data:", error.response.data);
          
          if (error.response.status === 403) {
            alert("API key may be invalid or expired. Please check your RapidAPI subscription.");
          } else if (error.response.status === 429) {
            alert("Too many requests. Please try again later.");
          } else {
            alert(`API Error: ${error.response.status} - Please try again later.`);
          }
        } else {
          console.error("Network or other error:", error.message);
          alert("Unable to fetch songs. Please check your internet connection.");
        }
        
        // Try fallback with mock data for testing
        console.log("Using fallback mock data for testing...");
        setMockSongs(mood);
      });
  };

  // Fallback search with simpler terms
  const tryFallbackSearch = (mood) => {
    const fallbackOptions = {
      method: "GET",
      url: "https://shazam.p.rapidapi.com/search",
      params: {
        term: mood.toLowerCase(),
        locale: "en-US",
        offset: "0",
        limit: "5",
      },
      headers: {
        "X-RapidAPI-Host": "shazam.p.rapidapi.com",
        "X-RapidAPI-Key":process.env.REACT_APP_MUSIC_API_KEY,
      },
    };

    axios.request(fallbackOptions)
      .then(function (response) {
        console.log("Fallback API Response:", response.data);
        
        if (response.data && response.data.tracks && response.data.tracks.hits && response.data.tracks.hits.length > 0) {
          setSongs(response.data.tracks.hits);
        } else {
          console.log("Fallback also failed, using mock data");
          setMockSongs(mood);
        }
      })
      .catch(function (error) {
        console.error("Fallback search failed:", error);
        setMockSongs(mood);
      });
  };

  // Mock data for testing when API fails
  const setMockSongs = (mood) => {
    const mockSongs = [
      {
        track: {
          title: `${mood} Song 1`,
          subtitle: "Artist 1",
          images: { coverart: "https://via.placeholder.com/150" },
          hub: { actions: [{ uri: "#" }] }
        }
      },
      {
        track: {
          title: `${mood} Song 2`,
          subtitle: "Artist 2",
          images: { coverart: "https://via.placeholder.com/150" },
          hub: { actions: [{ uri: "#" }] }
        }
      },
      {
        track: {
          title: `${mood} Song 3`,
          subtitle: "Artist 3",
          images: { coverart: "https://via.placeholder.com/150" },
          hub: { actions: [{ uri: "#" }] }
        }
      }
    ];
    
    console.log("Setting mock songs:", mockSongs);
    setSongs(mockSongs);
  };

  const emotions = [
    { emotion: "Happy", emoji: "😀", description: "Uplifting vibes" },
    { emotion: "Sad", emoji: "😔", description: "Melancholic melodies" },
    { emotion: "Surprised", emoji: "😲", description: "Unexpected beats" },
    { emotion: "Fearful", emoji: "😨", description: "Intense rhythms" },
    { emotion: "Angry", emoji: "😠", description: "Powerful sounds" },
    { emotion: "Disgusted", emoji: "🤢", description: "Alternative vibes" },
    { emotion: "Neutral", emoji: "😶", description: "Balanced tunes" },
  ];

  return (
    <MainContainer>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" py={4}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{
              background: 'linear-gradient(45deg, #fff, #f0f8ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              marginBottom: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            🎵 Mood Music 🎵
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: 300,
              marginBottom: 4 
            }}
          >
            Discover music that matches your emotions and the weather
          </Typography>
        </Box>

        {/* Status Cards */}
        <Box display="flex" justifyContent="center" gap={2} mb={4} flexWrap="wrap">
          {emotion && (
            <StyledChip 
              icon={<span>🎭</span>} 
              label={`Mood: ${emotion}`} 
              size="large"
            />
          )}
          {weather && (
            <StyledChip 
              icon={<span>🌤️</span>} 
              label={`Weather: ${weather}`} 
              size="large"
            />
          )}
        </Box>

        {/* Emotion Selection */}
        <GlassCard elevation={0}>
          <Typography 
            variant="h5" 
            textAlign="center" 
            sx={{ 
              color: 'white', 
              marginBottom: 3,
              fontWeight: 'bold'
            }}
          >
            How are you feeling today?
          </Typography>
          
          <Box 
            display="flex" 
            flexWrap="wrap" 
            justifyContent="center" 
            gap={2}
          >
            {emotions.map((item, index) => (
              <Box key={index} textAlign="center">
                <EmotionButton
                  emotion={item.emotion}
                  onClick={() => recommendSongs(item.emotion)}
                  size="large"
                >
                  {item.emoji}
                </EmotionButton>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    marginTop: 1,
                    fontWeight: 500
                  }}
                >
                  {item.emotion}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.75rem'
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </GlassCard>

        {/* AI Detection Button */}
        <Box textAlign="center" my={4}>
          <ActionButton 
            size="large"
            onClick={() => setWebcamModal(true)}
          >
            🤖 Let AI Detect My Mood!
          </ActionButton>
        </Box>

        {/* Webcam Modal */}
        {webcamModal && (
          <WebcamModal
            webcamModal={webcamModal}
            closeWebcamModal={() => setWebcamModal(false)}
            setEmotion={setEmotion}
            modelsLoaded={modelsLoaded}
          />
        )}

        {/* Loading */}
        {loader && (
          <GlassCard>
            <LoaderContainer>
              <Bars
                height="60"
                width="60"
                color="#fff"
                ariaLabel="bars-loading"
                visible={true}
              />
              <div className="loader-text">
                🎵 Finding perfect songs for you...
              </div>
            </LoaderContainer>
          </GlassCard>
        )}

        {/* Songs Display */}
        {showSongs && !loader && (
          <GlassCard>
            <Typography 
              variant="h5" 
              textAlign="center" 
              sx={{ 
                color: 'white', 
                marginBottom: 3,
                fontWeight: 'bold'
              }}
            >
              🎶 Your Personalized Playlist
            </Typography>
            
            {songs && songs.length > 0 ? (
              <SongGrid
                container
                spacing={3}
                justifyContent="center"
              >
                {songs.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '15px',
                        padding: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                        }
                      }}
                    >
                      <SongCard song={item} />
                    </Paper>
                  </Grid>
                ))}
              </SongGrid>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: 2
                  }}
                >
                  🔍 No songs found
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Try selecting a different mood or check your connection
                </Typography>
              </Box>
            )}
          </GlassCard>
        )}
      </Container>
    </MainContainer>
  );
}

export default MainComponent;