import React, { useEffect, useState } from 'react';
import styles from '../styles/Graph.module.css';
const Page3 = () => {
  const [heatmap, setHeatmap] = useState('');
  const [bubbleChart, setBubbleChart] = useState('');
  const [pieChart, setPieChart] = useState('');
  const [className1, setClassName1] = useState('');
  const [StudentName, setStudentName] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');

  const handleSearch1 = async () => {
    try {
      const response1 = await fetch('http://localhost:5000/generate_class_specific_bar_chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className: className1 }),
      });
      const data1 = await response1.text();
      setImage1(data1);

      const response2 = await fetch('http://localhost:5000/generate_class_participation_box_plot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className: className1 }),
      });
      const data2 = await response2.text();
      setImage2(data2);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSearch2 = async () => {
    try {
      const response1 = await fetch('http://localhost:5000/generate_student_attendance_bar_chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className: StudentName }),
      });
      const data1 = await response1.text();
      setImage3(data1);

      const response2 = await fetch('http://localhost:5000/generate_student_ranking_bar_graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className: StudentName }),
      });
      const data2 = await response2.text();
      setImage4(data2);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };


  useEffect(() => {
    // Fetch data for heatmap
    fetch('http://localhost:5000/generate_heatmap')
      .then((response) => response.text())
      .then((data) => setHeatmap(data))
      .catch((error) => console.error('Error fetching heatmap:', error));

    // Fetch data for bubble chart
    fetch('http://localhost:5000/generate_bubble_chart')
      .then((response) => response.text())
      .then((data) => setBubbleChart(data))
      .catch((error) => console.error('Error fetching bubble chart:', error));

    // Fetch data for pie chart
    fetch('http://localhost:5000/generate_pie_chart')
      .then((response) => response.text())
      .then((data) => setPieChart(data))
      .catch((error) => console.error('Error fetching pie chart:', error));
  }, []);


  return (
    <div>
      <h2>Graficas</h2>
      <div className={styles.container}>
        <div className={`${styles.searchContainer} ${styles.leftSearchContainer}`}>
          <p>Muestre graficas de una clase en especifico</p>
          <input
            type="text"
            placeholder="Coloque una clase"
            value={className1}
            onChange={(e) => setClassName1(e.target.value)}
          />
          <button onClick={handleSearch1}>Mostrar</button>
          {image1 && (
            <img
              className={styles.imageStCl}
              src={`data:image/png;base64,${image1}`}
              alt="Cargando..."
            />
          )}
          {image2 && (
            <img
              className={styles.imageStCl2}
              src={`data:image/png;base64,${image2}`}
              alt="Cargando..."
            />
          )}
        </div>
        <div className={`${styles.searchContainer} ${styles.rightSearchContainer}`}>
          <p>Muestre graficas de un estudiante en especifico</p>
          <input
            type="text"
            placeholder="Coloque un estudiante"
            value={StudentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <button onClick={handleSearch2}>Mostrar</button>
          {image3 && (
            <img
              className={styles.imageStCl}
              src={`data:image/png;base64,${image3}`}
              alt="Cargando..."
            />
          )}
          {image4 && (
            <img
              className={styles.imageStCl2}
              src={`data:image/png;base64,${image4}`}
              alt="Cargando..."
            />
          )}
        </div>
      </div>
      <div>
      <h2>Dashboard General</h2>
      <div className={styles.container}>
        <div className={`${styles.imageContainer} ${styles.leftImageContainer}`}>
          <img className={styles.image} src={`data:image/png;base64,${heatmap}`} alt="Cargando..." />
        </div>
        <div className={`${styles.imageContainer} ${styles.rightImageContainer}`}>
          <img className={styles.image} src={`data:image/png;base64,${bubbleChart}`} alt="Cargando..." />
        </div>
        <div className={`${styles.imageContainer} ${styles.centeredImageContainer}`}>
          <img className={styles.image} src={`data:image/png;base64,${pieChart}`} alt="Cargando..." />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Page3; 