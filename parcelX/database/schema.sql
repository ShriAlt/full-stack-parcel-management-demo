CREATE DATABASE IF NOT EXISTS parcel_db;
USE parcel_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(255) UNIQUE,
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(255),
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS parcels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tracking_id VARCHAR(255) NOT NULL UNIQUE,
    sender_id BIGINT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    pickup_zip_code VARCHAR(255) NOT NULL,
    pickup_contact_info VARCHAR(255) NOT NULL,
    drop_location VARCHAR(255) NOT NULL,
    drop_zip_code VARCHAR(255) NOT NULL,
    drop_contact_info VARCHAR(255) NOT NULL,
    weight DOUBLE NOT NULL,
    delivery_type VARCHAR(255) NOT NULL,
    packaging_type VARCHAR(255) NOT NULL,
    cost DOUBLE NOT NULL,
    pickup_date DATE NOT NULL,
    status ENUM('CREATED', 'PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL,
    cancel_reason VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_parcel_sender FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parcel_id BIGINT NOT NULL UNIQUE,
    amount DOUBLE NOT NULL,
    status ENUM('PAYMENT_PENDING', 'CONFIRMED', 'PAYMENT_FAILED') NOT NULL,
    method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'UPI') NOT NULL,
    transaction_id VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_payment_parcel FOREIGN KEY (parcel_id) REFERENCES parcels(id)
);

CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parcel_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(1000),
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_feedback_parcel FOREIGN KEY (parcel_id) REFERENCES parcels(id),
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id)
);
