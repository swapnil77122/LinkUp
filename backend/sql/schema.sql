-- contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    contact_id INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    sender VARCHAR(255) NOT NULL, -- e.g. 'me' or 'contact'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- indices
CREATE INDEX IF NOT EXISTS idx_messages_contact ON messages(contact_id);
