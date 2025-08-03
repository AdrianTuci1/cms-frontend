import React from 'react';
import styles from '../../../../styles/FormStyles.module.css';
import MemberFormFields from './MemberFormFields';
import MemberFormActions from './MemberFormActions';

const MemberDetailsForm = ({ 
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
        <MemberFormFields
          fields={fields}
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          mode={mode}
          isLoading={isLoading}
        />
        <MemberFormActions
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

export default MemberDetailsForm;