import React, { useRef, useState } from 'react';
import styles from '../styles/VideoCapture.module.css';


function VideoCapture() {
    const videoRef = useRef(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);
    const [recordingType, setRecordingType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');

    async function startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        setRecordingType(null); // Reset the recording type
        setMediaRecorder(null); // Reset the MediaRecorder instance
    }

    function startRecording(type) {
        if (videoRef.current.srcObject.active) {
            const stream = videoRef.current.srcObject;
            const recorder = new MediaRecorder(stream);
            let chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);

            recorder.onstop = async () => {
                const videoBlob = new Blob(chunks, { type: 'video/mp4' });
                uploadToServer(videoBlob);
                chunks = [];
            };

            setMediaRecorder(recorder);
            recorder.start();
            setRecording(true);
            setRecordingType(type);
        } else {
            console.error('MediaStream is inactive. Cannot start recording.');
        }
    }
    
    
    function stopRecording() {
        if (mediaRecorder && recording) {
            mediaRecorder.stop();
            setRecording(false);

            if (recordingType === 'main') {
                uploadToServer();
                runMainVideo();
                startRecording('partici');
            } else if (recordingType === 'partici') {
                console.log("HOla")
                setMediaRecorder(null);
                uploadParticiToServer();
                runParticiVideo();
            }
        }
    }
    
    
    
    
    async function uploadToServer(videoBlob) {
        try {
            const formData = new FormData();
            formData.append('video', videoBlob);
    
            const response = await fetch('http://localhost:5000/upload-video', {
                method: 'POST',
                body: formData
            });
    
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    }

    async function runMainVideo() {
        setLoading(true);
        setNotification('Procesando su video...');
        try {
            const response = await fetch('http://localhost:5000/run-main-video', {
                method: 'GET'
            });
            const result = await response.json();
            console.log(result.message);
            setLoading(false);
            if (result.message === "Script executed successfully") {
                setNotification('Los datos de los alumnos se han actualizado con exito!');
            } else {
                setNotification('Hubo un error en la ejecución del código, cheque su consola.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            setNotification('Hubo un error en la ejecución del código, cheque su consola.');
        }
    }
    async function runParticiVideo() {
        setLoading(true);
        setNotification('Procesando su video para participación...');
        try {
            const response = await fetch('http://localhost:5000/run-partici-video', {
                method: 'GET'
            });
            const result = await response.json();
            console.log(result.message);
            setLoading(false);
            if (result.message === "Script executed successfully") {
                setNotification('El video para participación se ha procesado con éxito!');
            } else {
                setNotification('Hubo un error en la ejecución del código, cheque su consola.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            setNotification('Hubo un error en la ejecución del código, cheque su consola.');
        }
    }
    
    async function uploadParticiToServer(videoBlob) {
        try {
            const formData = new FormData();
            formData.append('video', videoBlob);

            const response = await fetch('http://localhost:5000/upload-parti', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error uploading participation video:', error);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.videoContainer}>
                <div className={styles.videoWrapper}>
                    <video ref={videoRef} className={styles.video}></video>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={startCamera}>
                    Comenzar camara
                </button>
                <button className={styles.button} onClick={() => startRecording('main')}>
                    Empezar grabación de asistencia
                </button>
                <button className={styles.button} onClick={stopRecording}>
                    Empezar grabación de clase
                </button>
                <button className={styles.button} onClick={stopRecording}>
                    Terminar la clase
                </button>
                <p className={styles.notification}>{notification}</p>
            </div>
        </div>
    );
}

export default VideoCapture;