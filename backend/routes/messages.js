// backend/routes/messages.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { getBotReply } = require('../utils/bot');

module.exports = (io) => {
  // get messages for contact id
  router.get('/:contactId', async (req, res) => {
    const { contactId } = req.params;
    try {
      const { rows } = await db.query('SELECT * FROM messages WHERE contact_id = $1 ORDER BY created_at ASC', [contactId]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // post a new message (sender: 'me' or contact name)
  router.post('/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const { sender, content } = req.body;
    if (!sender || !content) return res.status(400).json({ error: 'sender and content required' });
    try {
      const { rows } = await db.query(
        'INSERT INTO messages (contact_id, sender, content) VALUES ($1, $2, $3) RETURNING *',
        [contactId, sender, content]
      );
      const message = rows[0];
      // emit message via socket.io to frontend clients
      io.emit('new_message', { contactId: parseInt(contactId), message });

      // If message is from 'me', optionally generate bot reply
      if (sender === 'me') {
        (async () => {
          const botText = await getBotReply(content);
          const { rows: botRows } = await db.query(
            'INSERT INTO messages (contact_id, sender, content) VALUES ($1, $2, $3) RETURNING *',
            [contactId, 'bot', botText]
          );
          const botMsg = botRows[0];
          io.emit('new_message', { contactId: parseInt(contactId), message: botMsg });
        })();
      }

      res.json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

  return router;
};
