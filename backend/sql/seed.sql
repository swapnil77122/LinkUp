INSERT INTO contacts (name, phone) VALUES
('Alice', '9876543210'),
('Bob', '9123456780')
RETURNING *;

INSERT INTO messages (contact_id, sender, content) VALUES
(1, 'Alice', 'Hey — how are you?'),
(1, 'me', 'I am good, thanks!'),
(2, 'Bob', 'Are you joining the meeting?'),
(2, 'me', 'Yes, at 4pm.');
