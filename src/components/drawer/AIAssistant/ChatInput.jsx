import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from './AIAssistantChat.module.css';

const ChatInput = ({ message, setMessage, handleSend, isLoading }) => {
  return (
    <div className={styles.inputArea}>
      <div style={{ position: 'relative' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.messageInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          className={styles.sendButton}
          disabled={!message.trim() || isLoading}
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

export default ChatInput; 