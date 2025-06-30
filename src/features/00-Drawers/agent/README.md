# AIAssistant Module

Modern, organized AI Assistant chat functionality with proper separation of concerns.

## Structure

```
AIAssistant/
├── components/          # React components
│   ├── AIAssistantChat.jsx  # Main chat container
│   ├── Chat.jsx             # Chat messages display
│   ├── ChatInput.jsx        # Message input component
│   ├── Message.jsx          # Individual message component
│   ├── Notifications.jsx    # Notification system
│   └── index.js             # Component exports
├── hooks/               # Custom React hooks
│   ├── useClickOutside.js   # Click outside detection
│   ├── useAutoScroll.js     # Auto-scroll functionality
│   └── index.js             # Hook exports
├── utils/               # Utility functions
│   ├── messageUtils.js      # Message handling utilities
│   └── index.js             # Utility exports
├── types/               # Type definitions
│   └── index.js             # Type definitions and constants
├── styles/              # CSS modules
│   └── AIAssistantChat.module.css
├── index.js             # Main module exports
└── README.md            # This file
```

## Components

### AIAssistantChat
Main container component that orchestrates the entire chat interface.

### Chat
Displays the message list with auto-scrolling and loading states.

### Message
Individual message component with edit, reply, and status functionality.

### ChatInput
Message input with auto-resize and keyboard shortcuts.

### Notifications
Notification system for displaying alerts and actions.

## Hooks

### useClickOutside
Detects clicks outside a referenced element.

### useAutoScroll
Automatically scrolls to bottom when messages change.

## Utilities

### messageUtils
- `formatTimestamp()` - Format message timestamps
- `createMessage()` - Create new message objects
- `validateMessage()` - Validate message content
- `getMessageStatus()` - Get human-readable status text

## Types

### Constants
- `MESSAGE_STATUS` - Message status constants
- `NOTIFICATION_TYPES` - Notification type constants

### Type Definitions
- `Message` - Message object structure
- `Notification` - Notification object structure
- `ChatProps` - Chat component props
- `MessageProps` - Message component props

## Usage

```javascript
// Import the main component
import AIAssistantChat from './components/drawer/AIAssistant';

// Or import specific parts
import { Chat, Message, useAutoScroll } from './components/drawer/AIAssistant';
```

## Features

- ✅ Modern React patterns with hooks
- ✅ Proper separation of concerns
- ✅ Reusable utilities and hooks
- ✅ Type definitions for better development experience
- ✅ Clean, organized file structure
- ✅ Easy to maintain and extend 