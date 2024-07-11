-- flyctl postgres connect -a fso-part13-db
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);
-- \d
-- \d blogs
INSERT INTO blogs (author, url, title, likes) VALUES ('Dario', 'https://onfire.com', 'On Fire', 15);
INSERT INTO blogs (url, title, likes) VALUES ('https://jstop.com', 'JS Top', 15);
SELECT * FROM blogs;