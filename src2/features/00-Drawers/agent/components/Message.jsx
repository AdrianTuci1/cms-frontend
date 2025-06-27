import React, { useState, useRef } from 'react';
import { FaArrowUp, FaReply, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from '../styles/AIAssistantChat.module.css';
import assistantData from '../../../../data/conversations.json';
import { formatTimestamp, getMessageStatus } from '../utils/messageUtils';
import { useClickOutside } from '../hooks/useClickOutside';
import { MESSAGE_STATUS } from '../types';

export const Message = ({ message, onReply, onEdit, isLoading }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  useClickOutside(replyInputRef, () => {
    setIsReplying(false);
    setReplyContent('');
  });

  useClickOutside(editInputRef, () => {
    setIsEditing(false);
    setEditContent('');
  });

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(message.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEdit = () => {
    if (!message.isAI && !isLoading) {
      setEditContent(message.content);
      setIsEditing(true);
    }
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent);
    }
    setIsEditing(false);
    setEditContent('');
  };

  const renderActionStatus = (message) => {
    if (!message.actionStatus) return null;

    switch (message.actionStatus) {
      case MESSAGE_STATUS.PENDING:
        return <FaSpinner className={styles.actionSpinner} />;
      case MESSAGE_STATUS.COMPLETED:
        return <FaCheck className={styles.actionSuccess} />;
      case MESSAGE_STATUS.ERROR:
        return <FaExclamationTriangle className={styles.actionError} />;
      default:
        return null;
    }
  };

  const renderMessageStatus = (message) => {
    if (!message.isAI && message.parentId) {
      const status = getMessageStatus(message);
      if (!status) return null;

      return (
        <div className={styles.messageStatus}>
          {message.actionStatus === MESSAGE_STATUS.PENDING && (
            <span className={styles.statusPending}>
              <FaSpinner className={styles.statusIcon} />
              {status}
            </span>
          )}
          {message.actionStatus === MESSAGE_STATUS.COMPLETED && (
            <span className={styles.statusCompleted}>
              <FaCheck className={styles.statusIcon} />
              {status}
            </span>
          )}
          {message.actionStatus === MESSAGE_STATUS.ERROR && (
            <span className={styles.statusError}>
              <FaExclamationTriangle className={styles.statusIcon} />
              {status}
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${styles.message} ${message.isAI ? styles.aiMessage : styles.userMessage}`}>
      <div className={styles.messageContent}>
        <div className={styles.messageHeader}>
          <span className={styles.agentName}>
            {message.isAI ? assistantData.assistant.name : 'You'}
          </span>
          <span className={styles.messageTime}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        
        {isEditing ? (
          <div className={styles.editInput} ref={editInputRef}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={styles.messageInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEditSubmit();
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditContent('');
                }
              }}
              disabled={isLoading}
              autoFocus
            />
            <button 
              onClick={handleEditSubmit}
              className={styles.sendButton}
              disabled={!editContent.trim() || isLoading || editContent === message.content}
            >
              <FaArrowUp />
            </button>
          </div>
        ) : (
          <div 
            className={`${styles.messageText} ${!message.isAI ? styles.editableMessage : ''}`}
            onClick={handleEdit}
            style={{ cursor: !message.isAI ? 'pointer' : 'default' }}
          >
            {message.content}
          </div>
        )}
        
        {message.isAI && !message.parentId && !isEditing && (
          <button 
            className={styles.replyButton}
            onClick={() => setIsReplying(!isReplying)}
            disabled={isLoading}
          >
            <FaReply />
            Reply
          </button>
        )}

        {isReplying && (
          <div className={styles.replyInput} ref={replyInputRef}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              className={styles.messageInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleReply();
                }
              }}
              disabled={isLoading}
              autoFocus
            />
            <button 
              onClick={handleReply}
              className={styles.sendButton}
              disabled={!replyContent.trim() || isLoading}
            >
              <FaArrowUp />
            </button>
          </div>
        )}

        {renderActionStatus(message)}
      </div>
      
      {renderMessageStatus(message)}
      
      {message.actionError && !message.parentId && (
        <div className={styles.actionError}>
          {message.actionError}
        </div>
      )}
      
      {message.actionResult && !message.parentId && (
        <div className={styles.actionResult}>
          {message.actionResult}
        </div>
      )}
    </div>
  );
}; 