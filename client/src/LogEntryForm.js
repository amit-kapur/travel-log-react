import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createLogEntry } from './API';

const LogEntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit= async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            const created = await createLogEntry(data);
            console.log(created);
            onClose();
        } catch (error) {
            console.log(error);
            setError(error);
            setLoading(false);
        }
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form"> 
    { error ? <h3>{error}</h3> : null }
        <label htmlFor="title">Title</label>
        <input name="title" required ref={register} />

        <label htmlFor="comments">Comments</label>
        <textarea name="comments" row={3} ref={register} />

        <label htmlFor="description">Description</label>
        <textarea name="description" row={3} ref={register} />

        <label htmlFor="image">Image</label>
        <input name="image" ref={register} />

        <label htmlFor="visitDate">Visit Date</label>
        <input name="visitDate" type="date" required  ref={register} />

        <button disabled={loading}>{loading ? 'Loading...' : 'Create Log Entry'}</button>
    </form>
  )
};

export default LogEntryForm;