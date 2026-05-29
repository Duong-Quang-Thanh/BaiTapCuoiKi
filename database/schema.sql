CREATE DATABASE admission_system;
USE admission_system;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50),
  phone VARCHAR(20)
);

CREATE TABLE universities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255)
);

CREATE TABLE majors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  university_id INT,
  name VARCHAR(255),
  FOREIGN KEY (university_id) REFERENCES universities(id)
);

CREATE TABLE applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  university_id INT,
  major_id INT,
  score FLOAT,
  status VARCHAR(50),
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);