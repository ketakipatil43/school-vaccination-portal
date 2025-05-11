import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VaccinationReport = () => {
    const [students, setStudents] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchVaccines();
        fetchStudents();
    }, [selectedVaccine]);

    const fetchVaccines = async () => {
        try {
            const response = await axios.get('https://localhost:44305/api/VaccinationDrive/list', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVaccines(response.data.data.items);
        } catch (error) {
            console.error('Error fetching vaccines:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                'https://localhost:44305/api/Student/list',
                {
                    params: {
                        isFilterApplied: true,
                        vaccinationDriveId: selectedVaccine,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setStudents(response.data.data.items);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleVaccineChange = (e) => {
        setSelectedVaccine(e.target.value);
        setCurrentPage(0);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Student Name', 'Class', 'Vaccinated', 'Date', 'Vaccine Name'],
            ...students.map((s) => [
                s.name,
                s.class,
                s.isVaccinated ? 'Yes' : 'No',
                s.dateOfVaccination || '',
                s.vaccineName || '',
            ]),
        ]
            .map((e) => e.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'vaccination_report.csv';
        link.click();
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Vaccination Report', 14, 15);

        const tableColumn = ['Student Name', 'Class', 'Vaccinated', 'Date', 'Vaccine Name'];
        const tableRows = students.map((s) => [
            s.name,
            s.class,
            s.isVaccinated ? 'Yes' : 'No',
            s.dateOfVaccination || '',
            s.vaccineName || '',
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10 },
            margin: { top: 10 },
        });

        doc.save('vaccination_report.pdf');
    };

    const pageCount = Math.ceil(students.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = students.slice(offset, offset + itemsPerPage);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Vaccination Report</h2>

            <div style={styles.filters}>
                <label style={styles.label}>Filter by Vaccine:</label>
                <select value={selectedVaccine} onChange={handleVaccineChange} style={styles.select}>
                    <option value="">All</option>
                    {vaccines.map((v) => (
                        <option key={v.uniqueId} value={v.uniqueId}>{v.name}</option>
                    ))}
                </select>

                <button onClick={exportToCSV} style={styles.button}>Download CSV</button>
                <button onClick={exportToPDF} style={{ ...styles.button, backgroundColor: '#28a745' }}>
                    Download PDF
                </button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Student Name</th>
                        <th style={styles.th}>Class</th>
                        <th style={styles.th}>Vaccinated</th>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Vaccine Name</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((s, i) => (
                        <tr key={i}>
                            <td style={styles.td}>{s.name}</td>
                            <td style={styles.td}>{s.class}</td>
                            <td style={styles.td}>{s.isVaccinated ? 'Yes' : 'No'}</td>
                            <td style={styles.td}>{s.dateOfVaccination || '—'}</td>
                            <td style={styles.td}>{s.vaccineName || '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.pagination}>
                {[...Array(pageCount).keys()].map((number) => (
                    <div
                        key={number}
                        onClick={() => handlePageClick({ selected: number })}
                        style={{
                            ...styles.page,
                            ...(currentPage === number ? styles.activePage : {}),
                        }}
                    >
                        {number + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    title: {
        textAlign: 'center',
        fontSize: '1.8rem',
        marginBottom: '20px',
        color: '#333',
    },
    filters: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    label: {
        fontWeight: 'bold',
    },
    select: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    th: {
        border: '1px solid #ddd',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        textAlign: 'left',
    },
    td: {
        border: '1px solid #ddd',
        padding: '10px',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
        gap: '10px',
    },
    page: {
        padding: '6px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#fff',
    },
    activePage: {
        backgroundColor: '#007bff',
        color: '#fff',
        fontWeight: 'bold',
    },
};

export default VaccinationReport;
