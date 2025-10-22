-- Create database if not exists
CREATE DATABASE IF NOT EXISTS loan_api;

USE loan_api;

-- Create loan_applications table
CREATE TABLE IF NOT EXISTS loan_applications (
    id VARCHAR(36) PRIMARY KEY,
    applicant_name VARCHAR(255) NOT NULL,
    property_address TEXT NOT NULL,
    credit_score INT NOT NULL,
    monthly_income DECIMAL(10, 2) NOT NULL,
    requested_amount DECIMAL(10, 2) NOT NULL,
    loan_term_months INT NOT NULL,
    crime_grade VARCHAR(1) NOT NULL,
    eligible BOOLEAN NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_applicant_name ON loan_applications(applicant_name);
CREATE INDEX idx_created_at ON loan_applications(created_at);
CREATE INDEX idx_eligible ON loan_applications(eligible);

CREATE TABLE IF NOT EXISTS loan_conditions (
    id VARCHAR(36) PRIMARY KEY,
    condition_name VARCHAR(255) NOT NULL,    
    activate BOOLEAN NOT NULL,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
