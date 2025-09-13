import React, { useEffect, useState, useRef } from 'react';
import { fetchMessages, postMessage } from '../services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export default function ChatWindow({ contact }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('connect', () => {
      // console.log('socket connected to server');
    });

    socketRef.current.on('new_message', (payload) => {
      // only append if it's for the current contact
      if (payload.contactId === contact.id) {
        setMessages((prev) => [...prev, payload.message]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [contact?.id]);

  useEffect(() => {
    if (!contact) return;
    (async () => {
      const msgs = await fetchMessages(contact.id);
      setMessages(msgs);
    })();
  }, [contact]);

  useEffect(() => {
    // scroll to bottom
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    await postMessage(contact.id, { sender: 'me', content: text });
    setText('');
    // backend will emit event and it will be appended from socket
  };

  if (!contact) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select a contact to start chat</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <div className="font-semibold">{contact.name}</div>
      </div>

      <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
        {messages.map(m => (
          <div key={m.id} className={`max-w-lg p-3 rounded ${m.sender === 'me' ? 'bg-blue-600 text-white self-end ml-auto' : 'bg-white text-gray-800'}`}>
            <div className="text-sm">{m.content}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
