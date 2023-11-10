import React, { useRef, useState } from 'react';

function CameraCapture() {
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [imageName, setImageName] = useState(""); 
    const [nombreDelAlumno, setNombreDelAlumno] = useState("");
    const [matricula, setMatricula] = useState("");
    const [fechaDeRegistro, setFechaDeRegistro] = useState("");
    const [clase, setClase] = useState("");

    async function startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
    }

    function captureImage() {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageUrl);
        uploadToServer(imageUrl, imageName);
        if (videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }

    async function uploadToServer(imageData) {
        try {
            const studentData = {
                image: imageData,
                nombre_del_alumno: nombreDelAlumno,
                matricula: matricula,
                fecha_de_registro: fechaDeRegistro,
                clase: clase
            };
            
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    }

    return (
        <div>
            <video ref={videoRef}></video>
            <button onClick={startCamera}>Comenzar camara</button>
            <div>
            <div>
                <label>Nombre del Alumno: </label>
                <input type="text" value={nombreDelAlumno} onChange={e => setNombreDelAlumno(e.target.value)} />
            </div>
            <div>
                <label>Matricula: </label>
                <input type="text" value={matricula} onChange={e => setMatricula(e.target.value)} />
            </div>
            <div>
                <label>Fecha de Registro: </label>
                <input type="date" value={fechaDeRegistro} onChange={e => setFechaDeRegistro(e.target.value)} />
            </div>
            <div>
                <label>Clase: </label>
                <input type="text" value={clase} onChange={e => setClase(e.target.value)} />
            </div>
        </div>
            <button onClick={captureImage}>Capturar camara y datos</button>
            {capturedImage && <img src={capturedImage} alt="Captured" />}
        </div>
    );
}

export default CameraCapture;
