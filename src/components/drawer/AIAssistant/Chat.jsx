import React, { useRef, useEffect, useState } from 'react';
import { FaArrowUp, FaReply, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from './AIAssistantChat.module.css';
import assistantData from '../../../data/conversations.json';
import aiAssistantService from '../../../services/aiAssistantService';

export const Message = ({ message, onReply, onEdit, isLoading }) => {
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

  const renderMessageStatus = (message) => {
    if (!message.isAI && message.parentId) {
      return (
        <div className={styles.messageStatus}>
          {message.actionStatus === 'pending' && (
            <span className={styles.statusPending}>
              <FaSpinner className={styles.statusIcon} />
              Processing...
            </span>
          )}
          {message.actionStatus === 'completed' && (
            <span className={styles.statusCompleted}>
              <FaCheck className={styles.statusIcon} />
              Completed
            </span>
          )}
          {message.actionStatus === 'error' && (
            <span className={styles.statusError}>
              <FaExclamationTriangle className={styles.statusIcon} />
              Error: {message.actionError}
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

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Load initial message history
    loadMessageHistory();

    // Add message handler for real-time messages
    const handleMessage = (response) => {
      setMessages(prev => [...prev, {
        id: response.messageId || Date.now(),
        content: response.content,
        isAI: response.type === 'agent.response',
        timestamp: response.timestamp,
        metadata: response.metadata
      }]);
      setIsLoading(false);
    };

    // Add error handler
    const handleError = (error) => {
      console.error('Chat error:', error);
      setIsLoading(false);
    };

    aiAssistantService.addMessageHandler(handleMessage);
    aiAssistantService.addErrorHandler(handleError);

    return () => {
      aiAssistantService.removeMessageHandler(handleMessage);
      aiAssistantService.removeErrorHandler(handleError);
    };
  }, []);

  const loadMessageHistory = async (before = null) => {
    try {
      setIsLoading(true);
      const historyMessages = await aiAssistantService.loadMessageHistory(20, before);
      
      if (historyMessages.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages(prev => {
        const newMessages = before ? [...prev, ...historyMessages] : historyMessages;
        return newMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      });
    } catch (error) {
      console.error('Failed to load message history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current || isLoading || !hasMore) return;

    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0) {
      const oldestMessage = messages[0];
      if (oldestMessage) {
        loadMessageHistory(oldestMessage.timestamp);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, {
      id: Date.now(),
      content,
      isAI: false,
      timestamp: new Date().toISOString()
    }]);

    try {
      await aiAssistantService.sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div 
        className={styles.messagesContainer}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {isLoading && messages.length === 0 && (
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.loadingSpinner} />
            Loading messages...
          </div>
        )}
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onReply={handleSendMessage}
            onEdit={async (messageId, newContent) => {
              try {
                await aiAssistantService.editMessage(messageId, newContent);
                setMessages(prev => prev.map(msg => 
                  msg.id === messageId ? { ...msg, content: newContent } : msg
                ));
              } catch (error) {
                console.error('Failed to edit message:', error);
              }
            }}
            isLoading={isLoading}
          />
        ))}
        {isLoading && messages.length > 0 && (
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.loadingSpinner} />
            Loading more messages...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat; 