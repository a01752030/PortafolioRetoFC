import React, { useState, useRef } from 'react';
import styles from '../styles/VideoCapture.module.css';

const VideoCapture = () => {
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [notification1, setNotification1] = useState('Asistencias sin actualizar');
  const [notification2, setNotification2] = useState('Participaciones sin actualizar');
  const [notification3, setNotification3] = useState('Grabacion en pausa');
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

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
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

      fetch('https://a2dc-200-39-29-132.ngrok.io/upload-assistance', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            setNotification1('Asistencias actualizadas');
          } else {
            setNotification1(`Error uploading video: ${response.statusText}`);
          }
        })
        .catch(error => setNotification1(`Error uploading video: ${error}`));
    };

    mediaRecorder.start();
    setNotification3('Grabando...');
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setNotification3('Grabacion en pausa');
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

      fetch('https://a2dc-200-39-29-132.ngrok.io/upload-parti', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            setNotification2('Participaciones actualizadas');
          } else {
            setNotification2(`Error uploading video: ${response.statusText}`);
          }
        })
        .catch(error => setNotification2(`Error uploading video: ${error}`));
    };
    mediaRecorder.start();
    setNotification3('Grabando...');
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
          <button className={styles['button']} onClick={() => { stopRecording(); stopCamera(); }}>Terminar clase</button>
        </div>
      </div>
      <div className={styles['notification-container']}>
  <p className={`${styles['notification']} ${notification1.includes('con exito') ? styles['notification-success'] : styles['notification-fail']}`}>
    {notification1}
  </p>
  <p className={`${styles['notification']} ${notification2.includes('con exito') ? styles['notification-success'] : styles['notification-fail']}`}>
    {notification2}
  </p>
  <p className={`${styles['notification']} ${notification3.includes('con exito') ? styles['notification-success'] : styles['notification-fail']}`}>
    {notification3}
  </p>
</div>
    </div>
  );
};

export default VideoCapture;