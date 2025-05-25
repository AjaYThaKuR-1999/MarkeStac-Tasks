# Real-Time Inventory Management System

A microservices-based inventory management system using Node.js, Express, MongoDB, and Socket.IO.

## Architecture & Design Decisions

The system is designed as two independent microservices:

1. **Inventory Service**: Handles CRUD operations for inventory items using MongoDB.
2. **Notification Service**: Manages real-time updates using Socket.IO.

Key design decisions:
- Microservices architecture for separation of concerns
- Containerization with Docker for consistent deployment
- MongoDB for flexible data storage

## Local Development Setup (Docker)

1. Prerequisites:
   - Docker & Docker Compose
   - Git

2. Setup:
```bash
git clone [repository-url]
cd inventory-management
docker-compose up -d --build
```

The services will be available at:
- Inventory Service: http://localhost:5100
- Notification Service: http://localhost:5101


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
