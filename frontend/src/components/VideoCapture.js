import React, { useState, useRef } from 'react';
import styles from '../styles/VideoCapture.module.css';

const VideoCapture = () => {
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream; // Set the media stream to the video element
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const startRecording = () => {
    const mediaRecorder = new MediaRecorder(stream);
    setRecorder(mediaRecorder);

    const recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('video', blob, 'recorded-video.webm');


      fetch('http://localhost:5000/upload-assistance', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            console.log('Video uploaded successfully');
          } else {
            console.error('Error uploading video:', response.statusText);
          }
        })
        .catch(error => console.error('Error uploading video:', error));
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
    }
  };

  const startRecordingAgain = () => {
    const mediaRecorder = new MediaRecorder(stream);
    setRecorder(mediaRecorder);

    const recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('video', blob, 'recorded-video.webm');


      fetch('http://localhost:5000/upload-parti', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            console.log('Video uploaded successfully');
          } else {
            console.error('Error uploading video:', response.statusText);
          }
        })
        .catch(error => console.error('Error uploading video:', error));
    };
    mediaRecorder.start();
};


return (
    <div>
        <h1>Centro de grabación de clase</h1>
        <p>Siga los botones para poder tomar asistencia y registrar participaciones</p>
        <p>La asistencia y la participación pueden demorar 2 minutos en aparecer en la parte de "estadísticas"</p>
    <div className={styles['video-capture-container']}>
      <div className={styles['video-container']}>
        <div className={styles['video-wrapper']}>
          <video ref={videoRef} className={styles['video']} autoPlay />
        </div>
        <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }} />
      </div>
      <div className={styles['button-container']}>
        <button className={styles['button']} onClick={startCamera}>Abrir camara</button>
        <button className={styles['button']} onClick={startRecording}>Tomar asistencias</button>
        <button className={styles['button']} onClick={stopRecording}>Terminar asistencias</button>
        <button className={styles['button']} onClick={startRecordingAgain}>Empezar clase</button>
        <button className={styles['button']} onClick={stopRecording}>Terminar clase</button>
      </div>
    </div>
    </div>
  );
};

export default VideoCapture;