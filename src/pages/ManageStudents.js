import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        class: '',
        id: '',
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://localhost:44305/api/student/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStudents(response.data.data.items);
        } catch (err) {
            console.error(err);
            setError('Failed to load student data.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudentClick = () => {
        setShowForm(true);
        setNewStudent({ name: '', class: '', id: '' });
        setEditingId(null); // not editing
    };

    const handleEditClick = (student) => {
        setShowForm(true);
        setNewStudent({
            name: student.name,
            class: student.class,
            id: student.id,
        });
        setEditingId(student.uniqueId);
    };

    const handleInputChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...newStudent,
            flag: editingId ? 2 : 1,
            uniqueId: editingId || 0,
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://localhost:44305/api/Student/insertupdate', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            alert(editingId ? 'Student updated successfully!' : 'Student added successfully!');
            setShowForm(false);
            setNewStudent({ name: '', class: '', id: '' });
            setEditingId(null);
            fetchStudents();
        } catch (err) {
            console.error(err);
            alert('Failed to save student.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={styles.container}>
            <h1>Manage Students</h1>

            <div style={styles.buttonsContainer}>
                <button style={styles.button} onClick={handleAddStudentClick}>
                    Add Student
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Student Name"
                        value={newStudent.name}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="class"
                        placeholder="Class"
                        value={newStudent.class}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="id"
                        placeholder="Student ID"
                        value={newStudent.id}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.submitButton}>
                        {editingId ? 'Update Student' : 'Add Student'}
                    </button>
                </form>
            )}

            <div style={styles.gridContainer}>
                {students.length === 0 ? (
                    <p>No students found.</p>
                ) : (
                    students.map((student) => (
                        <div key={student.uniqueId} style={styles.studentCard}>
                            <p><strong>Name:</strong> {student.name}</p>
                            <p><strong>Class:</strong> {student.class}</p>
                            <p><strong>Student ID:</strong> {student.id}</p>
                            <p><strong>Created:</strong> {new Date(student.createdDate).toLocaleDateString()}</p>
                            <p><strong>Modified:</strong> {new Date(student.modifiedDate).toLocaleDateString()}</p>
                            <button style={styles.editButton} onClick={() => handleEditClick(student)}>
                                Edit
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    input: {
        marginBottom: '10px',
        padding: '10px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#ffc107',
        color: '#000',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
    },
    studentCard: {
        background: '#ffffff',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
    },
};

export default ManageStudents;
