import { useState } from 'react';
import { FaRobot, FaArrowLeft, FaPlus } from 'react-icons/fa';
import styles from './ConversationsMenu.module.css';

const ConversationsMenu = () => {
  const [isConversationsMenuOpen, setIsConversationsMenuOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [intentInput, setIntentInput] = useState('');

  // Mock data for conversations - replace with actual data from your backend
  const conversations = [
    { id: 1, title: 'Conversation 1', lastMessage: 'Last message 1' },
    { id: 2, title: 'Conversation 2', lastMessage: 'Last message 2' },
    { id: 3, title: 'Conversation 3', lastMessage: 'Last message 3' },
  ];

  const handleIntentSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement intent processing logic
    console.log('Processing intent:', intentInput);
    setIntentInput('');
  };

  return (
    <div className={styles.conversationsContainer}>
      <button 
        className={styles.navIcon}
        onClick={() => setIsConversationsMenuOpen(!isConversationsMenuOpen)}
      >
        <FaRobot className={styles.icon} />
      </button>
      
      {isConversationsMenuOpen && (
        <div className={styles.conversationsMenu}>
          {selectedConversation ? (
            <div className={styles.conversationDetail}>
              <button 
                className={styles.backButton}
                onClick={() => setSelectedConversation(null)}
              >
                <FaArrowLeft /> Back to Conversations
              </button>
              <h3>{selectedConversation.title}</h3>
              <div className={styles.conversationContent}>
                {/* Add conversation content here */}
              </div>
            </div>
          ) : (
            <>
              <div className={styles.conversationList}>
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={styles.conversationItem}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <h4>{conversation.title}</h4>
                    <p>{conversation.lastMessage}</p>
                  </button>
                ))}
              </div>
              <form onSubmit={handleIntentSubmit} className={styles.intentForm}>
                <input
                  type="text"
                  value={intentInput}
                  onChange={(e) => setIntentInput(e.target.value)}
                  placeholder="Type your intent..."
                  className={styles.intentInput}
                />
                <button type="submit" className={styles.intentSubmit}>
                  <FaPlus />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationsMenu; 