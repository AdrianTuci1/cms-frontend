let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000;
let tenantId = null;

function connect(url) {
  try {
    socket = new WebSocket(url);

    socket.onopen = () => {
      postMessage({ type: 'SOCKET_CONNECTED' });
      reconnectAttempts = 0;
      joinChannel();
    };

    socket.onclose = () => {
      postMessage({ type: 'SOCKET_DISCONNECTED' });
      handleReconnect(url);
    };

    socket.onerror = (error) => {
      postMessage({ 
        type: 'SOCKET_ERROR', 
        error: error.message || 'WebSocket error occurred' 
      });
    };

    socket.onmessage = (event) => {
      try {
        console.log('Raw socket message received:', event.data);
        const message = JSON.parse(event.data);
        console.log('Parsed socket message:', message);
        
        // Handle Phoenix channel messages
        if (message.event === 'phx_reply') {
          console.log('Received Phoenix reply:', message);
          // Handle join/leave responses
          return;
        }
        
        // Handle actual messages
        const processedMessage = message.status === 'success' ? message.message : message;
        console.log('Sending processed message to main thread:', processedMessage);
        postMessage({ 
          type: 'SOCKET_MESSAGE', 
          message: processedMessage
        });
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  } catch (error) {
    postMessage({ 
      type: 'SOCKET_ERROR', 
      error: error.message || 'Failed to connect to WebSocket' 
    });
    handleReconnect(url);
  }
}

function handleReconnect(url) {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    setTimeout(() => connect(url), reconnectDelay);
  } else {
    postMessage({ 
      type: 'SOCKET_ERROR', 
      error: 'Max reconnection attempts reached' 
    });
  }
}

function joinChannel() {
  if (socket && socket.readyState === WebSocket.OPEN && tenantId) {
    socket.send(JSON.stringify({
      topic: `messages:${tenantId}`,
      event: "phx_join",
      payload: {},
      ref: generateRef()
    }));
  }
}

function generateRef() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Format message according to Phoenix channel protocol
    const formattedMessage = {
      topic: `messages:${message.tenant_id}`,
      event: "new_message",
      payload: {
        tenant_id: message.tenant_id,
        userId: message.userId,
        sessionId: message.sessionId,
        payload: {
          content: message.payload.content,
          context: message.payload.context || {}
        }
      },
      ref: generateRef()
    };
    console.log('Sending message to socket:', formattedMessage);
    socket.send(JSON.stringify(formattedMessage));
  } else {
    console.error('Socket not connected, cannot send message');
    postMessage({ 
      type: 'SOCKET_ERROR', 
      error: 'Socket is not connected' 
    });
  }
}

function disconnect() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

// Listen for messages from the main thread
self.onmessage = (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'CONNECT':
      tenantId = data.tenantId;
      connect(data.url);
      break;
    case 'SEND_MESSAGE':
      sendMessage(data.message);
      break;
    case 'DISCONNECT':
      disconnect();
      break;
    default:
      console.warn('Unknown message type:', type);
  }
}; 