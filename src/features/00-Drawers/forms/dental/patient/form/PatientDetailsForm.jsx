import React from 'react';
import styles from '../../../../styles/FormStyles.module.css';
import PatientFormFields from './PatientFormFields';
import PatientFormActions from './PatientFormActions';

const PatientDetailsForm = ({ 
  fields,
  formData,
  errors,
  handleInputChange,
  handleSubmit,
  handleDelete,
  mode,
  isLoading,
  isSubmitting,
  onCancel,
  onDelete
}) => {
  return (
    <div className={styles.formContent}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <PatientFormFields
          fields={fields}
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          mode={mode}
          isLoading={isLoading}
        />
        <PatientFormActions
          mode={mode}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          onDelete={onDelete}
          handleDelete={handleDelete}
        />
      </form>
    </div>
  );
};

export default PatientDetailsForm;