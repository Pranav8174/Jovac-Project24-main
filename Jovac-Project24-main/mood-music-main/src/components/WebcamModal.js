import React, { useEffect, useRef, useState } from "react";
import { Modal, Box } from "@mui/material";
import * as faceapi from "face-api.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "640px",
  bgcolor: "black",
  borderRadius: 5,
  p: 2,
};

function WebcamModal(props) {
  const { webcamModal, setEmotion, closeWebcamModal, modelsLoaded } = props;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;
  const intervalRef = useRef(null); // Use a ref for the interval
  const [faceDetected, setFaceDetected] = useState(true); // State for face detection status

  useEffect(() => {
    const videoElement = videoRef.current;

    if (modelsLoaded) {
      startVideo();
    }

    // Cleanup on component unmount
    return () => {
      stopVideo();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Only attempt to play after the stream has been set
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              console.error("Video play error:", err);
            });
          };
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
      });
  };

  const handleVideoOnPlay = () => {
    let emotions = {
      angry: 0,
      disgusted: 0,
      fearful: 0,
      happy: 0,
      neutral: 0,
      sad: 0,
      surprised: 0,
    };
    let total_frames = 0;

    intervalRef.current = setInterval(async () => {
      if (total_frames >= 50) {
        clearInterval(intervalRef.current);
        determineEmotion(emotions);
        stopVideo();
        closeWebcamModal();
        return;
      }

      if (webcamModal && canvasRef.current) {
        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const context = canvasRef.current.getContext("2d");
        if (context) {
          context.clearRect(0, 0, videoWidth, videoHeight);

          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

          // Set face detection status based on detections
          if (detections.length === 0) {
            setFaceDetected(false); // No face detected
          } else {
            setFaceDetected(true); // Face detected
            detections.forEach((item) => {
              for (let emotion in emotions) {
                emotions[emotion] += item.expressions[emotion] / 2;
              }
            });
          }
        }
        total_frames += 1;
      }
    }, 100);
  };

  const determineEmotion = (emotions) => {
    const maxEmotion = Object.keys(emotions).reduce((a, b) =>
      emotions[a] > emotions[b] ? a : b
    );
    setEmotion(maxEmotion.charAt(0).toUpperCase() + maxEmotion.slice(1));
  };

  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null; // Clear the video source
    }
  };

  const handleClose = () => {
    stopVideo();
    closeWebcamModal();
  };

  return (
    <Modal
      open={webcamModal}
      onClose={handleClose}
      aria-labelledby="webcam-modal-title"
      aria-describedby="webcam-modal-description"
    >
      <Box sx={style}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            {modelsLoaded ? (
              <>
                <video
                  ref={videoRef}
                  height={videoHeight}
                  width={videoWidth}
                  onPlay={handleVideoOnPlay}
                  style={{ borderRadius: "10px" }}
                />
                <canvas ref={canvasRef} style={{ position: "absolute" }} />
              </>
            ) : (
              <div style={{ color: "white" }}>Loading...</div>
            )}
          </div>
          {!faceDetected && (
            <div style={{ color: "red", marginTop: "10px" }}>
              No face detected. Please adjust your position.
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}

export default WebcamModal;
