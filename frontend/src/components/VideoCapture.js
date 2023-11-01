import React, { useRef, useState } from 'react';

function VideoCapture() {
    const videoRef = useRef(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);  
    const [notification, setNotification] = useState('');  

    async function startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        const recorder = new MediaRecorder(stream);
        let chunks = [];

        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = async () => {
            const videoBlob = new Blob(chunks, { type: 'video/mp4' });
            uploadToServer(videoBlob);
            chunks = [];
            stream.getTracks().forEach(track => track.stop());
        };
        setMediaRecorder(recorder);
    }

    function startRecording() {
        if (mediaRecorder) {
            mediaRecorder.start();
            setRecording(true);
        }
    }

    function stopRecording() {
        if (mediaRecorder && recording) {
            mediaRecorder.stop();
            setRecording(false);
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
        setLoading(true);  // Start loading
        setNotification('Procesando su video...');  // Show loading message
        try {
            const response = await fetch('http://localhost:5000/run-main-video', {
                method: 'POST'
            });

            const result = await response.json();
            console.log(result.message);
            setLoading(false);  // Stop loading

            // Set the notification based on the response
            if (result.message === "Script executed successfully") {
                setNotification('Los datos de los alumnos se han actualizado con exito!');
            } else {
                setNotification('Hubo un error en la ejecución del codigo, cheque su consola.');
            }
        } catch (error) {
            setLoading(false);  // Stop loading
            console.error('Error:', error);
            setNotification('Hubo un error en la ejecución del codigo, cheque su consola.');
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
