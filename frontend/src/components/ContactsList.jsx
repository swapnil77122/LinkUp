import React, { useEffect, useState } from 'react';
import { fetchContacts, createContact } from '../services/api';

export default function ContactsList({ onSelect }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const load = async () => {
    const data = await fetchContacts();
    setContacts(data);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name) return;
    const created = await createContact({ name, phone });
    setContacts(prev => [created, ...prev]);
    setName(''); setPhone('');
  };

  return (
    <div className="p-4">
      <form onSubmit={add} className="mb-4">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full p-2 mb-2 border rounded" />
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full p-2 mb-2 border rounded" />
        <button className="px-3 py-2 bg-green-600 text-white rounded">Add Contact</button>
      </form>

      <div>
        {contacts.map(c => (
          <div key={c.id} className="p-3 border rounded mb-2 hover:bg-gray-50 cursor-pointer" onClick={()=> onSelect(c)}>
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-gray-500">{c.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
