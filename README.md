# 🛍️ Tiny Store REST API

TinyStore is a REST API designed to power an e-commerce platform. It provides functionality for managing products, shopping carts, orders, authentication, and user preferences. Built with **Node.js**, **NestJS**, and **PostgreSQL**, it ensures efficient, scalable, and secure handling of sensitive e-commerce data. All modules have been extensively tested to maintain security and reliability.

## 🎮 Live Demo

To interact with the API, use the following demo credentials:

- **Client Account:**
  ```json
  {
    "email": "diego@example.com",
    "password": "clientPassword"
  }


- **Manager Account:**

```json
{
  "email": "ravn@example.com",
  "password": "managerPassword"
}
```

Swagger API Documentation: []

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET`

`DATABASE_URL`

# 💻 Run Locally

### 1. Clone the project

```bash
  git clone https://github.com/diegoareval/Ravn-Challenge-V2-Diego
```

### 2. Go to the project directory

```bash
  cd Ravn-Challenge-V2-Diego
```

### 3. Install dependencies

```bash
  yarn install
```

### 4. Start the server

```bash
  yarn start:dev
```

# 🧪  Running Tests

To run tests, run the following command

```bash
  yarn test
```

"""
## 🌟 Main Features

- **Authentication** using **JWT Strategy**, Guards & Custom Decorators for secure and scalable authentication processes.
  
- **Authorization** based on **RBAC (Role-Based Access Control)** with two roles:
  - **Customer**: Can read available products.
  - **Manager**: Can create, read, update, and delete products.

- **Clean Folder Structure**: Well-organized and commented code for ease of development and maintenance, with full API documentation provided by **Swagger**.

- **Prisma Global Module**: Efficient database management using Prisma ORM.
  
- **Singleton Services** for seamless **Amazon S3 integration** and other utilities, ensuring optimal performance and resource usage.

- **Product Management**: 
  - **Managers** have full control over product management (CRUD operations).
  - **Customers** can browse visible products.
"""

