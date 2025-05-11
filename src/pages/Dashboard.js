import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        upcomingDrives: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Retrieve token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found, please log in.');
                    setLoading(false);
                    return;
                }

                // Fetching aggregated data from the backend API with token in Authorization header
                const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/dashboard/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data.data.items;
                const upcomingDrives = data.filter((drive) => {
                    const driveDate = new Date(drive.dateOfDrive);
                    const today = new Date();
                    const thirtyDaysLater = new Date(today.setDate(today.getDate() + 30));
                    return driveDate <= thirtyDaysLater;
                });

                setMetrics({
                    upcomingDrives,
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Dashboard</h1>

            {/* Quick Navigation Links */}
            <div style={styles.quickLinksContainer}>
                <Link to="/manage-students" style={styles.link}>Manage Students</Link>
                <Link to="/manage-drives" style={styles.link}>Manage Vaccination Drives</Link>
                <Link to="/reports" style={styles.link}>Generate Reports</Link>
                <Link to="/enroll-students" style={styles.link}>Enroll Students in Vaccination Drive</Link>
            </div>

            <div style={styles.cardContainer}>
                {metrics.upcomingDrives.length === 0 ? (
                    <p>No upcoming vaccination drives within the next 30 days.</p>
                ) : (
                    metrics.upcomingDrives.map((drive, index) => (
                        <div key={index} style={styles.driveContainer}>
                            <h3>{drive.name}</h3>
                            <p>{new Date(drive.dateOfDrive).toLocaleDateString()}</p>
                            <div style={styles.tileGrid}>
                                <div style={styles.tile}>Total Students: {drive.totalStudent}</div>
                                <div style={styles.tile}>Vaccinated Students: {drive.totalVaccinatedStudent}</div>
                                <div style={styles.tile}>Vaccinated Percentage: {drive.vaccinatedStudentPercentage}%</div>
                                <div style={styles.tile}>Drive Name: {drive.name}</div>
                                <div style={styles.tile}>Drive Date: {new Date(drive.dateOfDrive).toLocaleDateString()}</div>
                                <div style={styles.tile}>Total Doses: {drive.totalDoses}</div>
                                <div style={styles.tile}>Available Doses: {drive.numberOfAvailableDoses}</div>
                                <div style={styles.tile}>Remaining Doses: {drive.numberOfAvailableDoses}</div>
                                <div style={styles.tile}>Vaccination Student Mappings: {drive.vaccinationStudentMapper.length}</div>
                            </div>
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
    quickLinksContainer: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
    },
    link: {
        textDecoration: 'none',
        color: '#007BFF',
        fontWeight: 'bold',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #007BFF',
        transition: 'background-color 0.3s',
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1200px',
        marginTop: '30px',
    },
    driveContainer: {
        marginBottom: '40px',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    tileGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginTop: '20px',
    },
    tile: {
        background: '#f0f0f0',
        padding: '15px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
};

export default Dashboard;
