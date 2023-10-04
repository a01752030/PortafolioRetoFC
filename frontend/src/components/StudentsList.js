import React, { useState, useEffect } from 'react';

function StudentsList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/get-students')
            .then(response => response.json())
            .then(data => {
                setStudents(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching students:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Lista de estudiantes</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre del Alumno</th>
                        <th>Matricula</th>
                        <th>Fecha de Registro</th>
                        <th>Clase</th>
                        <th>Asistencias</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student.nombre_del_alumno}</td>
                            <td>{student.matricula}</td>
                            <td>{student.fecha_de_registro}</td>
                            <td>{student.clase}</td>
                            <td>{student.asistencias}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentsList;