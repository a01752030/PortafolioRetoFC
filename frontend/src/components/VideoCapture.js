import React, { useRef, useState, useEffect } from 'react';

function VideoCapture() {
    const videoRef = useRef(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');

    // Added state to track the chunks and timer IDs
    const [chunks, setChunks] = useState([]);
    const [uploadTimer, setUploadTimer] = useState(null);
    const [notificationTimer, setNotificationTimer] = useState(null);

    useEffect(() => {
        // Cleanup function to clear the timers on component unmount
        return () => {
            if (mediaRecorder && recording) {
                mediaRecorder.stop();
            }
            if (uploadTimer) {
                clearTimeout(uploadTimer);
            }
            if (notificationTimer) {
                clearTimeout(notificationTimer);
            }
        };
    }, [mediaRecorder, recording, uploadTimer, notificationTimer]);

    async function startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = e => {
            // Append video data to the chunks array
            setChunks(prevChunks => [...prevChunks, e.data]);
        };

        recorder.onstop = async () => {
            setRecording(false);

            const streamTracks = stream.getTracks();
            streamTracks.forEach(track => track.stop());

            // Start a new recording after the first 2 minutes
            startRecording();
        };

        setMediaRecorder(recorder);

        // Start the upload timer to upload every 2 minutes
        const uploadTimerId = setInterval(() => {
            if (chunks.length > 0) {
                uploadToServer();
                setChunks([]); // Clear the chunks array
            }
        }, 120000); // 2 minutes in milliseconds

        setUploadTimer(uploadTimerId);

        // Display "Recording first 2 minutes" notification
        setNotification('Grabando primeros 2 minutos');
    }

    function startRecording() {
        if (mediaRecorder && !recording) {
            mediaRecorder.start();
            setRecording(true);

            // Stop recording after 2 minutes
            setTimeout(() => {
                if (recording) {
                    mediaRecorder.stop();
                }
            }, 120000); // 2 minutes in milliseconds
        }
    }

    function stopRecording() {
        if (mediaRecorder && recording) {
            mediaRecorder.stop();
        }
    }

    async function uploadToServer(videoBlob) {
        try {
            const formData = new FormData();
            formData.append('video', videoBlob);

            const response = await fetch('https://1f9e-201-162-233-114.ngrok.io/upload-video', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            console.log(result.message);

            // Display "Processing first 2 minutes" notification
            setNotification('Procesando primeros 2 minutos');

            // Display success or error notification for 5 seconds
            const notificationDisplayTimerId = setTimeout(() => {
                setNotification(result.message);
            }, 5000);

            setNotificationTimer(notificationDisplayTimerId);
        } catch (error) {
            console.error('Error uploading video:', error);

            // Display "Error uploading video" notification
            setNotification('Hubo un error al subir el video. Cheque su consola.');

            // Display error notification for 5 seconds
            const notificationDisplayTimerId = setTimeout(() => {
                setNotification('');
            }, 5000);

            setNotificationTimer(notificationDisplayTimerId);
        }
    }

    async function runMainVideo() {
        if (chunks.length > 0) {
            setLoading(true); // Start loading

            // Upload the video to the server before running the main video logic
            const videoBlob = new Blob(chunks, { type: 'video/mp4' });
            await uploadToServer(videoBlob);

            setLoading(false); // Stop loading

            // If successful, display "Recording remaining of the video" notification
            if (notification === 'Los datos de los alumnos se han actualizado con exito!') {
                setNotification('Grabando resto del video');
            }
        } else {
            // Notify the user that there is no video to upload
            setNotification(
                'No hay video para subir. Grabe al menos 2 minutos antes de actualizar la base de datos.'
            );
        }
    }

    return (
        <div>
            <video ref={videoRef}></video>
            <button onClick={startCamera}>Comenzar camara</button>
            <button onClick={startRecording}>Empezar a grabar clase</button>
            <button onClick={stopRecording}>Terminar clase</button>
            <button onClick={runMainVideo}>Actualizar base de datos</button>
            <p>{notification}</p>
        </div>
    );
}

export default VideoCapture;