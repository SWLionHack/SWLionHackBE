CREATE TABLE IF NOT EXISTS responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  answer ENUM('전혀 그렇지 않다', '그렇지 않다', '보통이다', '그렇다', '매우 그렇다') NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE DATABASE my_database;

USE my_database;

CREATE TABLE survey_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
