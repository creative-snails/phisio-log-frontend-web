import { useEffect, useState } from 'react';
import './MedicalConsultationsForm.css';

type Consultation = {
  consultant: string;
  date: string;
  diagnosis: string;
  followUpActions: string[];
  isOpen?: boolean;
};


const MedicalConsultationsForm = () => {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetch("/db.json")
        .then(response => response.json()) .then(data => {
            const records = data["health-records"];
            const Record = records?.[0];
            const loadedConsultations = (Record.medicalConsultations || []).map((c: Consultation) => ({
                ...c,
                isOpen: true,
            }));
            setConsultations(loadedConsultations);
        })
        .catch(error => {
            console.error('Error loading consultations:', error);
        });
    }, []);
    
    const addConsultation = () => {
        setConsultations([
            ...consultations,
            {
                consultant: '',
                date: '',
                diagnosis: '',
                followUpActions: [''],
                isOpen: true,
            },
        ]);
    };

    const updateConsultation = (index: number, field: keyof Consultation, value: any) => {
        const update = [...consultations];
        (update[index] as any)[field] = value;
        setConsultations(update);
        setSuccessMessage('');
    };

    const removeConsultation = (index: number) => {
        const update = [...consultations];
        update.splice(index,1);
        setConsultations(update);
        setSuccessMessage('');
    };

    const updateAction = (i: number, j: number, value: string) => {
        const update = [...consultations];
        update[i].followUpActions[j] = value;
        setConsultations(update);
        setSuccessMessage('');
    };

    const addAction = (i: number) => {
        const update = [...consultations];
        update[i].followUpActions.push('');
        setConsultations(update);
        setSuccessMessage('');
    };

    const removeAction = (i: number, j: number) =>{
        const update = [...consultations];
        update[i].followUpActions.splice(j,1);
        setConsultations(update);
        setSuccessMessage('');
    };

    const isValid = () =>{
        return consultations.every(c =>
            c.consultant.trim() &&
            c.date.trim() &&
            c.diagnosis.trim() &&
            c.followUpActions.length > 0
        );
    };

    const toggleCol = (index: number) => {
        const update = [...consultations];
        update[index].isOpen = !update[index].isOpen;
        setConsultations(update);
    };

    const handleUpdate = () => {
        console.log('Consultations update:', consultations);
        setSuccessMessage('Consultation saved');
    };

    return(
        <div className='Consultations-form-container'>
            {consultations.map((c,i) => (
                <div key = {i} className='consultation-card'>
                    <div className='consultation-header' onClick={() => toggleCol(i)}>
                        <h4>Consultation {i+1}</h4>
                        <button className='update-button' onClick={handleUpdate} disabled={!isValid()}>
                            Update Consultations
                        </button>
                    </div>
                    {c.isOpen && (
                        <div className='consultation-body'>
                            <label>Consultant</label>
                            <input type='text' value={c.consultant} onChange={e => updateConsultation(i, 'consultant', e.target.value)}/>

                            <label>Date</label>
                            <input type='date' value={c.date} onChange={e => updateConsultation(i, 'date', e.target.value)}/>

                            <label>Diagnosis</label>
                            <input type='text' value={c.diagnosis} onChange={e => updateConsultation(i, 'diagnosis', e.target.value)}/>

                            <label>Follow-Up Action</label>
                            <div className='follow-up-actions'>
                                {c.followUpActions.map((action,j) => (
                                    <div key={j} className='action-item'>
                                        <input type='text' value={action} onChange={e => updateAction(i, j, e.target.value)}/>
                                        <button className='remove-button' onClick={() => removeAction(i,j)}>
                                            X
                                        </button>
                                        </div>
                                ))}
                                <button className='add-button' onClick={() => addAction(i)}>
                                    + Add Action 
                                </button>
                                <button className='remove-button' onClick={(e) => {e.stopPropagation(); removeConsultation(i); }}>
                            Remove
                        </button>
                        {successMessage && <div className="success-message">{successMessage}</div>}

                            </div>
                            </div>
                    )}
                    </div>
            ))}
            <button className='add-button' onClick={addConsultation}>
                + Add Consultation 
            </button>
        </div>
    );
};
export default MedicalConsultationsForm