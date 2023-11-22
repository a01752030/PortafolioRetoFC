import styles from '../styles/CameraCapture.module.css';
import React, { useRef, useState } from 'react';

function CameraCapture() {
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [imageName, setImageName] = useState(""); 
    const [nombreDelAlumno, setNombreDelAlumno] = useState("");
    const [matricula, setMatricula] = useState("");
    const [fechaDeRegistro, setFechaDeRegistro] = useState("");
    const [clase, setClase] = useState("");
    const isFormFilled = nombreDelAlumno && matricula && fechaDeRegistro && clase;


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
        <div className={styles.cameraContainer}>
            <div className={styles.formContainer}>
                <h1>Sube tus datos a la BD</h1>
                <p>Asegurate de llenar todos los datos y dar click en "Comenzar camara" antes de capturar tus datos</p>
                <div>
                    <label htmlFor="nombreDelAlumno" className={styles.label}>
                        Nombre del Alumno:
                    </label>
                    <input
                        type="text"
                        id="nombreDelAlumno"
                        className={styles.inputField}
                        value={nombreDelAlumno}
                        onChange={(e) => setNombreDelAlumno(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="matricula" className={styles.label}>
                        Matricula:
                    </label>
                    <input
                        type="text"
                        id="matricula"
                        className={styles.inputField}
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fechaDeRegistro" className={styles.label}>
                        Fecha de Registro:
                    </label>
                    <input
                        type="date"
                        id="fechaDeRegistro"
                        className={styles.inputField}
                        value={fechaDeRegistro}
                        onChange={(e) => setFechaDeRegistro(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="clase" className={styles.label}>
                        Clase:
                    </label>
                    <input
                        type="text"
                        id="clase"
                        className={styles.inputField}
                        value={clase}
                        onChange={(e) => setClase(e.target.value)}
                    />
                </div>
                <button
                    onClick={captureImage}
                    disabled={!isFormFilled}
                    className={`${styles.captureButton} ${!isFormFilled ? styles.disabledButton : ''}`}
                >
                    Capturar camara y datos
                </button>
            </div>
            <div className={styles.videoContainer}>
            <div className={styles.videoWrapper}>
                <video ref={videoRef}></video>
                <div className={styles.placeholder}></div>
            </div>
            <div className={styles.buttonWrapper}>
                <button className={styles.startCameraButton} onClick={startCamera}>
                    Comenzar camara
                </button>
            </div>
            {capturedImage &&                 <img
                    src={capturedImage}
                    alt="Captured"
                    style={{ width: '200px',
                     height: '150px',
                    position:'absolute',
                    top:'30px',
                    left: '29.5px', }}
                />}
        </div>
        </div>

        
    );
}

export default CameraCapture;