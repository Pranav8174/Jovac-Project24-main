import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { keyframes } from "@emotion/react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import shazamIcon from "../assets/shazam.png";
import appleIcon from "../assets/apple.png";

// Animations
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 69, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(139, 69, 255, 0.6), 0 0 40px rgba(255, 20, 147, 0.3); }
`;

const CardContainer = styled(Box)({
  position: 'relative',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '20px',
  padding: '20px',
  height: '420px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
    borderColor: 'rgba(255,255,255,0.4)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
    animation: `${glow} 2s infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    transition: 'left 0.6s',
    pointerEvents: 'none',
  },
  '&:hover::before': {
    left: '100%',
  }
});

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '200px',
  borderRadius: '15px',
  overflow: 'hidden',
  marginBottom: '15px',
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
    pointerEvents: 'none',
  }
});

const SongImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  }
});

const PlayButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'rgba(255,255,255,0.9)',
  color: '#667eea',
  width: '60px',
  height: '60px',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255,255,255,0.3)',
  transition: 'all 0.3s ease',
  zIndex: 2,
  '&:hover': {
    background: 'rgba(255,255,255,1)',
    transform: 'translate(-50%, -50%) scale(1.1)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  }
});

const TitleContainer = styled(Box)({
  textAlign: 'center',
  marginBottom: '15px',
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SongTitle = styled(Typography)({
  color: 'white',
  fontWeight: 'bold',
  fontSize: '16px',
  lineHeight: 1.3,
  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const AudioContainer = styled(Box)({
  marginBottom: '15px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '40px',
});

const StyledAudio = styled('audio')({
  width: '100%',
  height: '35px',
  borderRadius: '20px',
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  '&::-webkit-media-controls-panel': {
    background: 'transparent',
  }
});

const NoAudioMessage = styled(Typography)({
  color: 'rgba(255,255,255,0.7)',
  fontSize: '14px',
  textAlign: 'center',
  fontStyle: 'italic',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

const LinksContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '15px',
});

const ServiceLink = styled('a')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.1)',
    background: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.4)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
    animation: `${pulse} 1s infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  }
});

const ServiceIcon = styled('img')({
  width: '28px',
  height: '28px',
  filter: 'brightness(1.2)',
  transition: 'all 0.3s ease',
});

const PlaceholderIcon = styled(MusicNoteIcon)({
  fontSize: '80px',
  color: 'rgba(255,255,255,0.5)',
  animation: `${float} 3s ease-in-out infinite`,
});

function SongCard(props) {
  const { song } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  // Extract song data with fallbacks
  const songImage = song.track?.share?.image || song.track?.images?.coverart || "";
  const songTitle = song.track?.share?.subject || song.track?.title || "Unknown Song";
  const artistName = song.track?.subtitle || "Unknown Artist";
  const audioUri = song.track?.hub?.actions?.[1]?.uri || "";
  const shazamLink = song.track?.share?.href || "#";
  const appleMusicLink = song.track?.hub?.options?.[0]?.actions?.[0]?.uri || "#";

  const handlePlayPause = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const displayTitle = `${songTitle}${artistName !== "Unknown Artist" ? ` - ${artistName}` : ""}`;

  return (
    <CardContainer>
      <ImageContainer>
        {songImage ? (
          <>
            <SongImage src={songImage} alt="Song Thumbnail" />
            {audioUri && (
              <PlayButton onClick={handlePlayPause}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </PlayButton>
            )}
          </>
        ) : (
          <PlaceholderIcon />
        )}
      </ImageContainer>

      <TitleContainer>
        <SongTitle variant="h6">
          {displayTitle}
        </SongTitle>
      </TitleContainer>

      <AudioContainer>
        {audioUri ? (
          <StyledAudio 
            controls 
            ref={setAudioRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={audioUri} type="audio/mpeg" />
            Your browser does not support the audio element.
          </StyledAudio>
        ) : (
          <NoAudioMessage variant="body2">
            <MusicNoteIcon fontSize="small" />
            Preview not available
          </NoAudioMessage>
        )}
      </AudioContainer>

      <LinksContainer>
        {shazamLink !== "#" && (
          <Tooltip title="Open in Shazam" arrow>
            <ServiceLink
              href={shazamLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ServiceIcon src={shazamIcon} alt="Shazam" />
            </ServiceLink>
          </Tooltip>
        )}
        
        {appleMusicLink !== "#" && (
          <Tooltip title="Open in Apple Music" arrow>
            <ServiceLink
              href={appleMusicLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ServiceIcon src={appleIcon} alt="Apple Music" />
            </ServiceLink>
          </Tooltip>
        )}
      </LinksContainer>
    </CardContainer>
  );
}

export default SongCard;