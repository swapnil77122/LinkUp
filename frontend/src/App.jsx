import React, { useState } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/SideBar';
import ChatWindow from './components/ChatWindow';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedContact, setSelectedContact] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark min-h-screen flex flex-col' : 'min-h-screen flex flex-col'}>
      <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectContact={(c) => { setSelectedContact(c); setActiveTab('chat'); }}
        />

        {/* Chat Window */}
        <div className="flex-1 flex flex-col border-l">
          <ChatWindow contact={selectedContact} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}
