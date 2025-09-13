import React, { useEffect, useState } from 'react';
import { fetchContacts, createContact } from '../services/api';

export default function Sidebar({ activeTab, setActiveTab, onSelectContact }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // load contacts
  useEffect(() => {
    (async () => {
      const data = await fetchContacts();
      setContacts(data);
    })();
  }, []);

  // add contact
  const add = async (e) => {
    e.preventDefault();
    if (!name) return;
    const created = await createContact({ name, phone });
    setContacts((prev) => [created, ...prev]);
    setName('');
    setPhone('');
  };

  return (
    <div className="w-80 flex flex-col border-r bg-white">
      {/* Tabs */}
      <div className="p-3 flex gap-2 border-b">
        <button
          className={`px-3 py-2 rounded text-sm font-medium ${activeTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('chat')}
        >
          Chats
        </button>
        <button
          className={`px-3 py-2 rounded text-sm font-medium ${activeTab === 'contacts' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
      </div>

      {/* Conditional Rendering */}
      {activeTab === 'contacts' && (
        <div className="p-3 border-b">
          <form onSubmit={add} className="space-y-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 border rounded text-sm"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full p-2 border rounded text-sm"
            />
            <button className="w-full py-2 bg-green-600 text-white rounded text-sm">
              Add Contact
            </button>
          </form>
        </div>
      )}

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 && (
          <div className="p-4 text-gray-400 text-center text-sm">No contacts yet</div>
        )}
        {contacts.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectContact(c)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 border-b"
          >
            {/* Circle avatar with first letter */}
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-900">{c.name}</div>
              {c.phone && <div className="text-xs text-gray-500">{c.phone}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
