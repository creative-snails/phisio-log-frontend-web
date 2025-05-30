import { useState } from 'react';

import './HealthStatusForm.css';

const HealthStatusForm = () => {
const stageOptions = ['open', 'closed', 'in-progress'];
const severityOptions = ['mild', 'moderate', 'severe', 'variable'];
const progressionOptions = ['improving', 'stable', 'worsening', 'variable'];
const [status, setStatus] = useState({stage: '', severity: '', progression: ''});

const handleChange = (field: string, value: string) => {
    setStatus(prev => ({...prev, [field]: value}));
};

const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saved status:', status);
};

const handleCancel = () => {
    setStatus({stage: '', severity: '', progression: ''});
};

return (
    <form className= "health-status-form" onSubmit={handleSave}>
        <h2>Status</h2>
        <div className = "form-group">
            <label>Stage:</label>
            <select value = {status.stage} onChange={(e) => handleChange( 'stage', e.target.value)}>
                <option value = " ">Select</option>
                {stageOptions.map(opt => <option key = {opt} value = {opt}>
                    {opt}
                </option>)}
            </select>
        </div>
        <div className = "form-group">
            <label>Severity:</label>
            <select value = {status.severity} onChange = {(e) => handleChange('severity', e.target.value)}>
                <option value = " ">Select</option>
                {severityOptions.map(opt => <option key = {opt} value = {opt}>
                    {opt}
                </option>)}
            </select>
        </div>
        <div className = "form-group">
            <label>Progression:</label>
            <select value = {status.progression} onChange = {(e) => handleChange('progression', e.target.value)}>
                <option value = " ">Select</option>
                {progressionOptions.map(opt => <option key = {opt} value = {opt}>
                    {opt}
                </option>)}
            </select>
        </div>
        <div className = "button-group">
            <button type = "submit" className = "save-button">Save</button>
            <button type = "button" onClick = {handleCancel} className = "cancel-button">Cancel</button>
        </div>
    </form>
  );
};
export default HealthStatusForm;