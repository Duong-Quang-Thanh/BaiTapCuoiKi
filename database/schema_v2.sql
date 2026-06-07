-- Admission System - Enhanced Schema
CREATE DATABASE IF NOT EXISTS admission_system;
USE admission_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Universities table
CREATE TABLE IF NOT EXISTS universities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Majors (Ngành học) table
CREATE TABLE IF NOT EXISTS majors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  university_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

-- Exam Combinations (Tổ hợp xét tuyển) table
CREATE TABLE IF NOT EXISTS exam_combinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  major_id INT NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  subjects VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE CASCADE
);

-- Admission Batches (Đợt tuyển sinh) table
CREATE TABLE IF NOT EXISTS admission_batches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles (Hồ sơ thí sinh) table
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  date_of_birth DATE,
  id_number VARCHAR(50),
  address VARCHAR(500),
  priority_group VARCHAR(50),
  gpa FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Documents (Minh chứng) table
CREATE TABLE IF NOT EXISTS documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Applications (Hồ sơ nộp) table
CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  batch_id INT NOT NULL,
  university_id INT NOT NULL,
  major_id INT NOT NULL,
  exam_combination_id INT NOT NULL,
  score FLOAT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  note TEXT,
  submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES admission_batches(id),
  FOREIGN KEY (university_id) REFERENCES universities(id),
  FOREIGN KEY (major_id) REFERENCES majors(id),
  FOREIGN KEY (exam_combination_id) REFERENCES exam_combinations(id)
);

-- Email Notifications Log table
CREATE TABLE IF NOT EXISTS email_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  application_id INT,
  sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'sent',
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_application_user ON applications(user_id);
CREATE INDEX idx_application_status ON applications(status);
CREATE INDEX idx_application_batch ON applications(batch_id);
CREATE INDEX idx_major_university ON majors(university_id);
CREATE INDEX idx_exam_combo_major ON exam_combinations(major_id);
