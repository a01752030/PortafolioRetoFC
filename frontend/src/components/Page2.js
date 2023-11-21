import React from 'react';
import CameraCapture from './CameraCapture';

const Page2 = () => {

    const handleImageCapture = (imageUrl) => {
        console.log("Captured Image:", imageUrl);
    };
    return (
        <div>
            <CameraCapture onCapture={handleImageCapture} />
        </div>
    );
};



export default Page2;