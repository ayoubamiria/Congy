import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'C:/Users/User/Desktop/Conges/Congy/conge/frconge/src/Pages/page-css/historique.css'
import { differenceInDays } from 'date-fns';


const Attente = () => {
    const handleEdit = async (id) => {
        try {
            await axios.put(`http://localhost:3000/demande-conge/rejeter/${id}`);
            // Update the state to reflect the change
            setConges((prevConges) =>
                prevConges.map((conge) =>
                    conge._id === id ? { ...conge, status: 'rejete' } : conge
                )
            );
        } catch (error) {
            console.error('Error rejecting leave request:', error);
        }
    }
    const [conges, setConges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConges = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/demande-conge/attente`);
                setConges(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConges();
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className='Historique'> <h2>Historique des Congés</h2></div>
            <div className='aaa'>
                <p><a href="/attente" className="en attente">conges en attente</a>
                </p>
                <a href="/verif" className="en attente">tout les conges </a>


            </div>
            {conges.length === 0 ? (
                <p>Aucun congé trouvé.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Raison</th>
                            <th>Nombre des jour(s)</th>
                            <th>Date debut</th>
                                <th>Date fin</th>
                                <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conges.map((conge) => (
                            <tr key={conge._id}>
                                <td>{conge.type}</td>
                                <td>
                                    <span className={`status ${conge.status.toLowerCase()}`}>
                                        {conge.status}
                                    </span>
                                </td>
                                <td>{conge.reason}</td>
                                <td>
                                    {differenceInDays(new Date(conge.endDate), new Date(conge.startDate))}
                                </td>

                                <td>  {new Date(conge.startDate).toLocaleDateString()}</td>
                                <td>  {new Date(conge.endDate).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleEdit(conge._id)}>rejeter
                                    </button><button className="btn btn-primary">approuver
                                    </button>
                                    
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};


export default Attente;