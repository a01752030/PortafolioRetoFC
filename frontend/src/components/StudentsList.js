// StudentsList.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/StudentList.module.css';

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchName, setSearchName] = useState('');
  const [searchClase, setSearchClase] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/get-students')
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
        setFilteredStudents(data); // Initialize with all students
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Sort the filtered students whenever sortColumn or sortOrder changes
    const sortedStudents = [...filteredStudents].sort((a, b) => {
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];

      if (sortOrder === 'asc') {
        if (typeof columnA === 'string' && typeof columnB === 'string') {
          return columnA.localeCompare(columnB, undefined, { numeric: true });
        } else {
          return columnA - columnB;
        }
      } else {
        if (typeof columnA === 'string' && typeof columnB === 'string') {
          return columnB.localeCompare(columnA, undefined, { numeric: true });
        } else {
          return columnB - columnA;
        }
      }
    });

    setFilteredStudents(sortedStudents);
  }, [sortColumn, sortOrder, filteredStudents]);

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      // Toggle sortOrder if clicking on the same column
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set a new column for sorting if clicking on a different column
      setSortColumn(columnName);
      setSortOrder('asc');
    }
  };

  const handleNameSearch = () => {
    const query = searchName.toLowerCase();
    const filtered = students.filter((student) =>
      student.nombre_del_alumno.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleClaseSearch = () => {
    const query = searchClase.toLowerCase();
    const filtered = students.filter((student) =>
      student.clase.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchClase('');
    setSortColumn(null);
    setSortOrder('asc');
    setFilteredStudents(students);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.studentsListContainer}>
      <div>
        <h2>Lista de estudiantes registrados</h2>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchBar}>
            <label htmlFor="searchName">Buscar por Nombre:</label>
            <input
              type="text"
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button onClick={handleNameSearch}>Buscar</button>
          </div>
          <div className={styles.searchBar}>
            <label htmlFor="searchClase">Buscar por Clase:</label>
            <input
              type="text"
              id="searchClase"
              value={searchClase}
              onChange={(e) => setSearchClase(e.target.value)}
            />
            <button onClick={handleClaseSearch}>Buscar</button>
          </div>
        </div>
        <div className={styles.resetButtonContainer}>
          <button className={styles.resetButton} onClick={handleReset}>
            Mostrar todo
          </button>
        </div>
      </div>
      <table className={styles.studentsTable}>
        <thead>
          <tr>
            <th
              className={`${styles.sortableColumn} ${
                sortColumn === 'nombre_del_alumno' && sortOrder === 'asc' ? styles.sortedAsc : ''
              } ${sortColumn === 'nombre_del_alumno' && sortOrder === 'desc' ? styles.sortedDesc : ''}`}
              onClick={() => handleSort('nombre_del_alumno')}
            >
              Nombre del Alumno
            </th>
            <th
              className={`${styles.sortableColumn} ${
                sortColumn === 'matricula' && sortOrder === 'asc' ? styles.sortedAsc : ''
              } ${sortColumn === 'matricula' && sortOrder === 'desc' ? styles.sortedDesc : ''}`}
              onClick={() => handleSort('matricula')}
            >
              Matricula
            </th>
            <th
              className={`${styles.sortableColumn} ${
                sortColumn === 'fecha_de_registro' && sortOrder === 'asc' ? styles.sortedAsc : ''
              } ${sortColumn === 'fecha_de_registro' && sortOrder === 'desc' ? styles.sortedDesc : ''}`}
              onClick={() => handleSort('fecha_de_registro')}
            >
              Fecha de Registro
            </th>
            <th
              className={`${styles.sortableColumn} ${
                sortColumn === 'clase' && sortOrder === 'asc' ? styles.sortedAsc : ''
              } ${sortColumn === 'clase' && sortOrder === 'desc' ? styles.sortedDesc : ''}`}
              onClick={() => handleSort('clase')}
            >
              Clase
            </th>
            <th
              className={`${styles.sortableColumn} ${
                sortColumn === 'asistencias' && sortOrder === 'asc' ? styles.sortedAsc : ''
              } ${sortColumn === 'asistencias' && sortOrder === 'desc' ? styles.sortedDesc : ''}`}
              onClick={() => handleSort('asistencias')}
            >
              Asistencias
            </th>
            <th
              className={`${styles.sortableColumn} ${
                sortColumn === 'participaciones' && sortOrder === 'asc' ? styles.sortedAsc : ''
              } ${sortColumn === 'participaciones' && sortOrder === 'desc' ? styles.sortedDesc : ''}`}
              onClick={() => handleSort('participaciones')}
            >
              Participaciones totales
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id}>
              <td>{student.nombre_del_alumno}</td>
              <td>{student.matricula}</td>
              <td>{student.fecha_de_registro}</td>
              <td>{student.clase}</td>
              <td>{student.asistencias}</td>
              <td>{student.participaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentsList;