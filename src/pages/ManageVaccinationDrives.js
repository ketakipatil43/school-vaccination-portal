import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageVaccinationDrives = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dateOfDrive: '',
        totalDoses: '',
        numberOfAvailableDoses: ''
    });

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://localhost:44305/api/VaccinationDrive/list', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDrives(res.data.data.items);
        } catch (err) {
            console.error(err);
            setError('Failed to load vaccination drives.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setShowForm(true);
        setFormData({
            name: '',
            dateOfDrive: '',
            totalDoses: '',
            numberOfAvailableDoses: ''
        });
        setEditingId(null);
    };

    const handleEditClick = (drive) => {
        setShowForm(true);
        setFormData({
            name: drive.name,
            dateOfDrive: drive.dateOfDrive.slice(0, 10), // format YYYY-MM-DD
            totalDoses: drive.totalDoses,
            numberOfAvailableDoses: drive.numberOfAvailableDoses
        });
        setEditingId(drive.uniqueId);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const now = new Date().toISOString();

        const payload = {
            ...formData,
            flag: editingId ? 2 : 1,
            uniqueId: editingId || 0,
            createdDate: now,
            modifiedDate: now,
            vaccinationStudentMapper: []
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://localhost:44305/api/VaccinationDrive/insertupdate', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert(editingId ? 'Drive updated!' : 'Drive added!');
            setShowForm(false);
            setFormData({
                name: '',
                dateOfDrive: '',
                totalDoses: '',
                numberOfAvailableDoses: ''
            });
            setEditingId(null);
            fetchDrives();
        } catch (err) {
            console.error(err);
            alert('Failed to save drive.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={styles.container}>
            <h1>Manage Vaccination Drives</h1>

            <div style={styles.buttonsContainer}>
                <button style={styles.button} onClick={handleAddClick}>
                    Add Vaccination Drive
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Drive Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="date"
                        name="dateOfDrive"
                        value={formData.dateOfDrive}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="number"
                        name="totalDoses"
                        placeholder="Total Doses"
                        value={formData.totalDoses}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="number"
                        name="numberOfAvailableDoses"
                        placeholder="Available Doses"
                        value={formData.numberOfAvailableDoses}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.submitButton}>
                        {editingId ? 'Update Drive' : 'Add Drive'}
                    </button>
                </form>
            )}

            <div style={styles.gridContainer}>
                {drives.length === 0 ? (
                    <p>No vaccination drives found.</p>
                ) : (
                    drives.map((drive) => (
                        <div key={drive.uniqueId} style={styles.card}>
                            <p><strong>Name:</strong> {drive.name}</p>
                            <p><strong>Date:</strong> {new Date(drive.dateOfDrive).toLocaleDateString()}</p>
                            <p><strong>Total Doses:</strong> {drive.totalDoses}</p>
                            <p><strong>Available Doses:</strong> {drive.numberOfAvailableDoses}</p>
                            <button style={styles.editButton} onClick={() => handleEditClick(drive)}>
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
        backgroundColor: '#eef6ff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonsContainer: {
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        marginBottom: '20px',
    },
    input: {
        marginBottom: '10px',
        padding: '10px',
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
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
    },
    card: {
        background: '#ffffff',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    editButton: {
        marginTop: '10px',
        padding: '5px 10px',
        backgroundColor: '#ffc107',
        color: '#000',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default ManageVaccinationDrives;
