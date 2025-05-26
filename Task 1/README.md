# Real-Time Inventory Management System

A microservices-based inventory management system designed for real-time inventory tracking and notifications.

## instructions to set up and run the application locally using Docker

### To set up and run the application locally using Docker, follow the steps below:

- Clone the repository
Begin by cloning this repository to your local machine.

- Ensure Docker is installed
Make sure Docker is installed and running on your system. You can download it from Docker's official website.

- Navigate to the relevant task directory
Use your terminal to navigate to the specific task or project directory you want to run with Docker.

- Build and start the containers
Run the following command to build the Docker images and start the containers in detached mode:

- docker compose up -d --build
This command will create the necessary images and spin up the associated containers.

- Shut down the containers
When you're done, you can stop and remove the running containers using:

docker compose down

## Deployment Guide: AWS EC2 Setup and Configuration
- To deploy the application on AWS EC2, I will first log into the AWS Management Console and navigated to the EC2 dashboard. From there, I launched a new instance, selected Ubuntu as the operating system, and used the Free Tier eligible settings. For authentication, I chose the key pair login method, utilizing a previously generated key. During the setup, I configured the security group to allow inbound traffic on HTTP (port 6100, 6101, 6102) and SSH (port 22) by selecting “Anywhere” as the source — this ensures that the instance is accessible for both web and SSH connections.

- Once the instance was up and running, I SSH’d into it and cloned the GitHub repository. I also set up a GitHub Actions self-hosted runner on the instance for CI/CD purposes. To securely manage environment variables, I created a folder outside the runner’s directory to store the .env file, and referenced its path within the application. With this setup, every push to the repository triggers an automatic deployment via the runner, enabling seamless and secure updates to the EC2-hosted application.


## Architecture & Design Decisions

### Microservices Architecture
The system is architected as two independent, loosely coupled microservices:

1. **Inventory Service**
   - Primary responsibility: Managing inventory data
   - Tech Stack: Node.js, Express.js, MongoDB
   - Features:
     - RESTful API endpoints for CRUD operations
     - Data validation and business logic
     - Connection pooling for MongoDB
     - Error handling and logging
   - Design Decisions:
     - Clean architecture with separation of concerns
     - Repository pattern for data access
     - Middleware-based request processing
     - Environment-based configuration

2. **Notification Service**
   - Primary responsibility: Real-time communication
   - Tech Stack: Node.js, Express.js, Socket.IO
   - Features:
     - WebSocket-based real-time updates
     - Event-driven architecture
     - Connection management
     - Broadcasting capabilities
   - Design Decisions:
     - Event-driven communication model
     - Scalable WebSocket implementation
     - Room-based subscription system
     - Graceful error handling for real-time connections

### Infrastructure Design

1. **Containerization**
   - Docker-based deployment for consistent environments
   - Multi-stage builds for optimized images
   - Environment variable configuration
   - Volume mounts for persistent storage

2. **Database Design**
   - MongoDB NoSQL database for flexible schema
   - Document-based data model
   - Indexing for performance optimization
   - Connection pooling for scalability

3. **Communication Patterns**
   - REST API for synchronous operations
   - WebSocket for real-time updates
   - Event-driven architecture for loose coupling
   - Request/response pattern for API calls

### Security Considerations
- Environment-based configuration
- Input validation and sanitization
- Error handling and logging
- Secure WebSocket connections
- Rate limiting for API endpoints

### Scalability Features
- Container-based deployment
- Independent service scaling
- Connection pooling
- Event-driven architecture
- WebSocket room management

### Error Handling & Monitoring
- Comprehensive error handling middleware
- Structured logging
- Request/response tracking
- Graceful degradation
- Resource monitoring

This architecture provides a scalable, maintainable, and efficient solution for real-time inventory management while maintaining separation of concerns and following modern software development best practices.


## AWS EC2 Deployment Guide

1. Launch EC2 instance:
   - Ubuntu Server 20.04 LTS
   - t3.medium instance type
   - 20GB EBS volume

2. Security Group Configuration:
   - HTTP: Port 80 (Inbound)
   - HTTPS: Port 443 (Inbound)
   - SSH: Port 22 (Inbound - restrict to your IP)
   - Custom TCP: Port 27017 (MongoDB)
   - Custom TCP: Port 5100-5101 (Application)

3. Environment Setup:
```bash
# Install Docker and Docker Compose
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER

# Clone and deploy
sudo mkdir -p /opt/inventory-system
cd /opt/inventory-system
git clone [repository-url]
cd inventory-management

# Configure environment variables
sudo cp .env.example .env
# Edit .env with production values

# Run the application
sudo docker-compose up -d
```

4. Post-deployment:
   - Set up SSL/TLS using Let's Encrypt
   - Configure Nginx as a reverse proxy
   - Set up monitoring with Prometheus/Grafana
   - Configure backup solutions for MongoDB

## API Documentation

### Inventory Service

#### Create Item
```http
POST /api/v1/items/create
Content-Type: application/json

{
    "name": "string",
    "description": "string",
    "quantity": number,
    "reorderLevel": number,
    "unitPrice": number
}
```

#### Get All Items
```http
GET /api/v1/items/getAll
```

#### Get Item by ID
```http
GET /api/v1/items/get/:id
```

#### Update Item
```http
PUT /api/v1/items/update/:id
Content-Type: application/json

{
    "name": "string",
    "description": "string",
    "quantity": number,
    "reorderLevel": number,
    "unitPrice": number
}
```

#### Delete Item
```http
DELETE /api/v1/items/delete/:id
```

## Security Features

- Environment-based configuration
- Input validation
- CORS policy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, please open an issue in the GitHub repository. Configure load balancer

## Architecture Decisions

1. **Microservices Architecture**
   - Separation of concerns
   - Independent scaling
   - Fault isolation
   - Technology flexibility

2. **Real-time Communication**
   - Socket.IO for real-time updates
   - Redis for message queuing
   - MongoDB for update history

3. **Security**
   - JWT authentication
   - Rate limiting
   - Helmet security headers
   - Environment-based configuration

4. **Performance**
   - Redis caching
   - MongoDB indexes
   - Pagination support
   - Efficient queries

5. **Scalability**
   - Containerized deployment
   - Load balancing support
   - Horizontal scaling
   - Microservice architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, please open an issue in the GitHub repository.
