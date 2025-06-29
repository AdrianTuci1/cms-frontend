import React, { useEffect } from 'react';
import { useRulesStore } from '../../store/rulesStore';
import styles from './TriggersView.module.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const TriggersView = () => {
  const {
    triggers,
    isLoading,
    error,
    selectedTrigger,
    isEditing,
    toggleTrigger,
    addTrigger,
    updateTrigger,
    deleteTrigger,
    selectTrigger,
    clearSelection,
    setEditing,
    fetchTriggers,
    saveTrigger,
    deleteTriggerAsync
  } = useRulesStore();

  // Fetch triggers on component mount
  useEffect(() => {
    fetchTriggers();
  }, [fetchTriggers]);

  const handleAddTrigger = () => {
    setEditing(true);
    clearSelection();
  };

  const handleEditTrigger = (triggerId) => {
    selectTrigger(triggerId);
    setEditing(true);
  };

  const handleDeleteTrigger = async (triggerId) => {
    if (window.confirm('Sigur doriți să ștergeți acest trigger?')) {
      await deleteTriggerAsync(triggerId);
    }
  };

  const handleToggleTrigger = (triggerId) => {
    toggleTrigger(triggerId);
  };

  if (error) {
    return (
      <div className={styles.triggersView}>
        <div className={styles.error}>
          <p>Eroare la încărcarea trigger-elor: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.triggersView}>
      <div className={styles.triggersHeader}>
        <h2>Triggers</h2>
        <button 
          className={styles.addButton}
          onClick={handleAddTrigger}
          disabled={isLoading}
        >
          <FaPlus className={styles.icon} />
          Adaugă Trigger
        </button>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <p>Se încarcă...</p>
        </div>
      )}

      <div className={styles.triggersGrid}>
        {triggers.map((trigger) => (
          <div key={trigger.id} className={styles.triggerCard}>
            <div className={styles.triggerHeader}>
              <h3>{trigger.name}</h3>
              <div className={styles.triggerActions}>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleEditTrigger(trigger.id)}
                  disabled={isLoading}
                >
                  <FaEdit className={styles.icon} />
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleDeleteTrigger(trigger.id)}
                  disabled={isLoading}
                >
                  <FaTrash className={styles.icon} />
                </button>
              </div>
            </div>
            <div className={styles.triggerDetails}>
              <p className={styles.triggerDescription}>
                {trigger.description}
              </p>
              <div className={styles.triggerStatus}>
                <span className={`${styles.statusBadge} ${trigger.isActive ? styles.active : styles.inactive}`}>
                  {trigger.isActive ? 'Activ' : 'Inactiv'}
                </span>
                <button
                  className={styles.toggleButton}
                  onClick={() => handleToggleTrigger(trigger.id)}
                  disabled={isLoading}
                >
                  {trigger.isActive ? 'Dezactivează' : 'Activează'}
                </button>
              </div>
              {trigger.executionCount > 0 && (
                <div className={styles.triggerStats}>
                  <span>Execuții: {trigger.executionCount}</span>
                  {trigger.lastExecuted && (
                    <span>Ultima execuție: {new Date(trigger.lastExecuted).toLocaleDateString('ro-RO')}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {triggers.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <p>Nu există trigger-e configurate.</p>
          <button 
            className={styles.addButton}
            onClick={handleAddTrigger}
          >
            <FaPlus className={styles.icon} />
            Adaugă primul trigger
          </button>
        </div>
      )}
    </div>
  );
};

export default TriggersView; 