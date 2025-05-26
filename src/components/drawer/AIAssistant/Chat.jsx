import React, { useRef, useEffect, useState } from 'react';
import { FaArrowUp, FaReply, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from './AIAssistantChat.module.css';
import assistantData from '../../../data/conversations.json';

const Message = ({ message, onReply, onEdit, isLoading }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (replyInputRef.current && !replyInputRef.current.contains(event.target)) {
        setIsReplying(false);
        setReplyContent('');
      }
      if (editInputRef.current && !editInputRef.current.contains(event.target)) {
        setIsEditing(false);
        setEditContent('');
      }
    };

    if (isReplying || isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isReplying, isEditing]);

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

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderActionStatus = (message) => {
    if (!message.actionStatus) return null;

    switch (message.actionStatus) {
      case 'pending':
        return <FaSpinner className={styles.actionSpinner} />;
      case 'completed':
        return <FaCheck className={styles.actionSuccess} />;
      case 'error':
        return <FaExclamationTriangle className={styles.actionError} />;
      default:
        return null;
    }
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
        
        {message.isAI && !isEditing && (
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
      {message.actionError && (
        <div className={styles.actionError}>
          {message.actionError}
        </div>
      )}
      {message.actionResult && (
        <div className={styles.actionResult}>
          {message.actionResult}
        </div>
      )}
    </div>
  );
};

const Chat = ({ messages, isLoading, replyToMessage, editMessage }) => {
  const chatContentRef = useRef(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  // Group messages by thread
  const threadMessages = messages.filter(m => !m.parentId);
  const replyMessages = messages.filter(m => m.parentId);

  return (
    <div className={styles.chatContent} ref={chatContentRef}>
      {threadMessages.map((msg) => (
        <div key={msg.id} className={styles.messageThread}>
          <Message 
            message={msg} 
            onReply={replyToMessage}
            onEdit={editMessage}
            isLoading={isLoading}
          />
          {replyMessages
            .filter(reply => reply.parentId === msg.id)
            .map(reply => (
              <div key={reply.id} className={styles.replyThread}>
                <Message 
                  message={reply}
                  onReply={replyToMessage}
                  onEdit={editMessage}
                  isLoading={isLoading}
                />
              </div>
            ))}
        </div>
      ))}
      {isLoading && (
        <div className={`${styles.message} ${styles.aiMessage}`}>
          <div className={styles.messageContent}>
            <FaSpinner className={styles.loadingSpinner} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat; 