import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EnrollStudents = () => {
    const [students, setStudents] = useState([]);
    const [vaccinationDrives, setVaccinationDrives] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedDrive, setSelectedDrive] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Fetch Students and Vaccination Drives on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found, please log in.');
                    setLoading(false);
                    return;
                }

                // Fetch students list
                const studentsResponse = await axios.get('https://localhost:44305/api/Student/list', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token to headers
                    },
                });
                setStudents(studentsResponse.data.data.items);

                // Fetch vaccination drives list
                const drivesResponse = await axios.get('https://localhost:44305/api/VaccinationDrive/list', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token to headers
                    },
                });
                setVaccinationDrives(drivesResponse.data.data.items);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStudent || !selectedDrive) {
            setError('Please select both a student and a vaccination drive.');
            return;
        }

        try {
            // Retrieve token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in.');
                return;
            }

            // API call to insert or update the mapping between student and vaccination drive
            const response = await axios.post('https://localhost:44305/api/VaccinationStudentMapper/insertupdate', {
                flag: 1,
                studentUniqueId: selectedStudent,
                vaccinationDriveUniuqId: selectedDrive,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add token to headers
                },
            });

            setMessage('Student enrolled successfully in the vaccination drive.');
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to enroll student in vaccination drive.');
            setMessage('');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Enroll Student in Vaccination Drive</h1>

            {message && <p style={styles.successMessage}>{message}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="student" style={styles.label}>Student Name</label>
                    <select
                        id="student"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        style={styles.input}
                    >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.uniqueId}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="drive" style={styles.label}>Vaccination Drive</label>
                    <select
                        id="drive"
                        value={selectedDrive}
                        onChange={(e) => setSelectedDrive(e.target.value)}
                        style={styles.input}
                    >
                        <option value="">Select Vaccination Drive</option>
                        {vaccinationDrives.map((drive) => (
                            <option key={drive.id} value={drive.uniqueId}>
                                {drive.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" style={styles.submitButton}>Enroll Student</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
        gap: '15px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '1rem',
        color: '#333',
        marginBottom: '5px',
    },
    input: {
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    submitButton: {
        padding: '12px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    successMessage: {
        color: 'green',
        fontSize: '1.2rem',
        marginBottom: '20px',
    },
};

export default EnrollStudents;
