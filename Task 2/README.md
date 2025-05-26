# Healthcare Management System

## instructions to set up and run the application locally using Docker
To set up and run the application locally using Docker, follow the steps below:

Clone the repository
Begin by cloning this repository to your local machine.

Ensure Docker is installed
Make sure Docker is installed and running on your system. You can download it from Docker's official website.

Navigate to the relevant task directory
Use your terminal to navigate to the specific task or project directory you want to run with Docker.

Build and start the containers
Run the following command to build the Docker images and start the containers in detached mode:

docker compose up -d --build
This command will create the necessary images and spin up the associated containers.

Shut down the containers
When you're done, you can stop and remove the running containers using:

docker compose down


## HIPAA Compliance Overview

This healthcare management system implements several key HIPAA compliance measures to ensure the security and privacy of Protected Health Information (PHI). Here's how HIPAA compliance is ensured:

1. **Access Control**
   - Role-based authentication system with JWT tokens
   - Different roles (admin, organization, practitioner, patient) with appropriate access levels
   - Token expiration (11 hours) and validation
   - Secure token storage and transmission

2. **Data Security**
   - Password hashing using bcrypt
   - Secure MongoDB connection for data storage
   - Role-based access control for sensitive operations
   - Secure document handling through DocuSign integration

3. **Audit Controls**
   - Detailed logging of all operations
   - Timestamp tracking for all user actions
   - Secure audit trail maintenance

4. **Transmission Security**
   - JWT-based secure authentication
   - HTTPS enforcement through middleware
   - Secure document signing through DocuSign

5. **Documentation**
   - Clear separation of concerns through microservices
   - Well-documented API endpoints
   - Secure configuration management

## Architecture and Design Decisions

- The task mentioned implementing clinic onboarding, but it did not specify where this process should occur. To address this, I created a third microservice named organisation to handle clinic onboarding functionality.

- For secure data transmission between the client and server, I implemented RSA encryption using the node-rsa package. This automatically encrypts outgoing requests and decrypts incoming ones. To test the workflow locally, you’ll need to temporarily disable the encryption middleware. Comment out the following lines in app.js:
const { rsaEncryptionMiddleware } = require('./src/middleware/dataEncryption');
app.use(rsaEncryptionMiddleware);

- The task also required that an agreement be created during clinic onboarding. To fulfill this, I created a dummy admin and generated an agreement between the admin and the clinic during the onboarding process.

- HL7 schemas can include a wide range of fields. For this implementation, I have selected only the most relevant fields necessary for the current scope of data handling.

This system follows a microservices architecture with three main services:

1. **Appointment Service**
   - Handles appointment scheduling and management
   - Implements doctor availability checking
   - Manages patient-doctor relationships
   - Uses MongoDB for data persistence

2. **Document Service**
   - Manages document generation and signing
   - Integrates with DocuSign for secure document handling
   - Uses Puppeteer for PDF generation
   - Implements contract agreement workflows

3. **Organization Service**
   - Manages organization and user authentication
   - Handles user role management
   - Implements JWT-based authentication
   - Manages user registration and login

Key Design Decisions:

1. **Security**
   - JWT-based authentication across all services
   - Role-based access control
   - Password hashing with bcrypt
   - Secure document handling

2. **Scalability**
   - Microservices architecture for independent scaling
   - Docker containerization for deployment
   - MongoDB for flexible data storage

3. **Maintainability**
   - Clear separation of concerns
   - Modular code structure
   - Consistent error handling
   - Comprehensive logging

4. **Integration**
   - DocuSign integration for secure document signing
   - MongoDB for database operations
   - Express.js for RESTful API endpoints

This architecture ensures a robust, secure, and scalable healthcare management system while maintaining HIPAA compliance through proper access controls, data security measures, and audit capabilities.
