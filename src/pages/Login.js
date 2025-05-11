import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://localhost:44305/api/Login/search', {
                userName,
                password,
            });

            const userData = response.data;

            if (userData.data != null) {
                localStorage.setItem('token', userData.data.accessToken);
                navigate('/dashboard');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" style={styles.button}>Login</button>
                    {error && <p style={styles.error}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f4f8',
    },
    card: {
        background: '#ffffff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    button: {
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        color: '#d9534f',
        marginTop: '10px',
        textAlign: 'center',
    },
};

export default Login;
