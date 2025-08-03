import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaTimes, FaChevronDown, FaChevronRight, FaEye, FaEdit, FaTrash, FaCog, FaSpinner, FaSave } from 'react-icons/fa';
import styles from '../../../styles/FormStyles.module.css';

// Import actions
import {
    getPermissionResources,
    getAvailablePermissions,
    validatePermissionsForm,
    handlePermissionsSubmit,
    handlePermissionsDelete
} from './actions/permissionsActions';

const PermissionsForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
    const [roleData, setRoleData] = useState({
        name: '',
        description: '',
        permissions: {},
        ...data
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedResources, setExpandedResources] = useState(new Set());

    const resources = getPermissionResources();
    const permissions = getAvailablePermissions();

    useEffect(() => {
        if (data) {
            setRoleData({
                name: data.name || '',
                description: data.description || '',
                permissions: data.permissions || {},
                ...data
            });
        }
    }, [data]);

    const handleInputChange = (field, value) => {
        setRoleData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePermissionChange = (resourceId, permissionId, checked) => {
        setRoleData(prev => {
            const newPermissions = { ...prev.permissions };

            if (checked) {
                if (!newPermissions[resourceId]) {
                    newPermissions[resourceId] = [];
                }
                if (!newPermissions[resourceId].includes(permissionId)) {
                    newPermissions[resourceId] = [...newPermissions[resourceId], permissionId];
                }
            } else {
                if (newPermissions[resourceId]) {
                    newPermissions[resourceId] = newPermissions[resourceId].filter(p => p !== permissionId);
                }
            }

            return {
                ...prev,
                permissions: newPermissions
            };
        });
    };

    const hasPermission = (resourceId, permissionId) => {
        return roleData.permissions[resourceId]?.includes(permissionId) || false;
    };

    const toggleResource = (resourceId) => {
        setExpandedResources(prev => {
            const newSet = new Set(prev);
            if (newSet.has(resourceId)) {
                newSet.delete(resourceId);
            } else {
                newSet.add(resourceId);
            }
            return newSet;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validatePermissionsForm(roleData);

        if (Object.keys(validationErrors).length > 0) {
            console.error('Validation errors:', validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await handlePermissionsSubmit(roleData, mode, onSubmit);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;

        setIsSubmitting(true);
        try {
            await handlePermissionsDelete(roleData, onDelete);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPermissionCount = (resourceId) => {
        return roleData.permissions[resourceId]?.length || 0;
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formFields}>
                    {/* Basic Role Information */}
                    <div className={styles.formGroup}>
                        <label className={`${styles.formLabel} ${styles.requiredLabel}`}>Nume Rol</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={roleData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Introduceți numele rolului"
                            disabled={mode === 'view' || isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Descriere</label>
                        <textarea
                            className={styles.formTextarea}
                            value={roleData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Descrierea rolului și responsabilitățile acestuia"
                            disabled={mode === 'view' || isLoading}
                        />
                    </div>

                    {/* Permissions Section */}
                    <div className={styles.formSection}>
                        <h3 className={styles.formSectionTitle}>
                            <FaShieldAlt />
                            Permisiuni
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', marginBottom: '1rem' }}>
                            Selectați permisiunile pe care le va avea acest rol pentru fiecare resursă
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {resources.map(resource => {
                                const isExpanded = expandedResources.has(resource.id);
                                const permissionCount = getPermissionCount(resource.id);

                                return (
                                    <div key={resource.id} style={{
                                        border: '1px solid hsl(214.3 31.8% 91.4%)',
                                        borderRadius: '0.5rem',
                                        overflow: 'hidden'
                                    }}>
                                        <div
                                            style={{
                                                padding: '1rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                background: isExpanded ? 'hsl(210 40% 98%)' : 'hsl(0 0% 100%)',
                                                borderBottom: isExpanded ? '1px solid hsl(214.3 31.8% 91.4%)' : 'none'
                                            }}
                                            onClick={() => toggleResource(resource.id)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <FaShieldAlt style={{ color: 'hsl(215.4 16.3% 46.9%)' }} />
                                                <div>
                                                    <div style={{ fontWeight: '500', color: 'hsl(222.2 84% 4.9%)' }}>{resource.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'hsl(215.4 16.3% 46.9%)' }}>{resource.description}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {permissionCount > 0 && (
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: 'hsl(215.4 16.3% 46.9%)',
                                                        background: 'hsl(210 40% 96%)',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '0.25rem'
                                                    }}>
                                                        {permissionCount} permisiuni
                                                    </span>
                                                )}
                                                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div style={{
                                                padding: '1rem',
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                gap: '0.75rem',
                                                background: 'hsl(210 40% 98%)'
                                            }}>
                                                {permissions.map(permission => {
                                                    const isChecked = hasPermission(resource.id, permission.id);
                                                    const PermissionIcon = permission.id === 'read' ? FaEye :
                                                        permission.id === 'write' ? FaEdit :
                                                            permission.id === 'delete' ? FaTrash : FaCog;

                                                    return (
                                                        <div
                                                            key={permission.id}
                                                            style={{
                                                                padding: '0.75rem',
                                                                border: `1px solid ${isChecked ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(214.3 31.8% 91.4%)'}`,
                                                                borderRadius: '0.375rem',
                                                                background: isChecked ? 'hsl(221.2 83.2% 53.3% / 0.1)' : 'hsl(0 0% 100%)',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s ease'
                                                            }}
                                                            onClick={() => handlePermissionChange(resource.id, permission.id, !isChecked)}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <PermissionIcon style={{ color: isChecked ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(215.4 16.3% 46.9%)' }} />
                                                                    <span style={{ fontWeight: '500', color: 'hsl(222.2 84% 4.9%)' }}>{permission.name}</span>
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={(e) => handlePermissionChange(resource.id, permission.id, e.target.checked)}
                                                                    className={styles.formCheckbox}
                                                                    disabled={mode === 'view' || isLoading}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                            <p style={{ fontSize: '0.75rem', color: 'hsl(215.4 16.3% 46.9%)', margin: 0 }}>{permission.description}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                    >
                        <FaTimes /> Anulează
                    </button>

                    {mode === 'edit' && onDelete && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className={styles.deleteButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className={styles.spinner} />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <FaTrash />
                                    Șterge Rol
                                </>
                            )}
                        </button>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className={styles.spinner} />
                                {mode === 'create' ? 'Creating...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                <FaSave />
                                {mode === 'create' ? 'Creează Rol' : 'Salvează Modificările'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PermissionsForm;