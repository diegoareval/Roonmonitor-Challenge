# Simple Store REST API


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
  "email": "roommonitor@example.com",
  "password": "managerPassword"
}
```


## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET`

`DATABASE_URL`
`BUCKET_NAME`

# 💻 Run Locally

### 1. Clone the project

```bash
  git clone https://github.com/diegoareval/Roonmonitor-Challenge
```

### 2. Go to the project directory

```bash
  cd Roonmonitor-Challenge
```

### 3. Install dependencies

```bash
  yarn install
```

### 4. Execute migrations

```bash
  yarn prisma:generate
```

```bash
  prisma:migrate:save
```

```bash
  prisma:migrate:run
```

### 5. Run Seeds

```bash
  yarn run seed
```

### 6. Start the server

```bash
  yarn start:dev
```

[See Swagger documentation here](http:localhost:3000/api-docs)

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


## 🌟 Documentation
[Heroku Deploy](https://dev.to/ezilemdodana/deploying-nestjs-apps-to-heroku-a-comprehensive-guide-hhj)

[Docker](https://www.docker.com/)

[Prisma](https://www.prisma.io/)

[Postgres](https://www.postgresql.org/)

[NestJs](https://nestjs.com/)

[JEST](https://jestjs.io/)

[JWT](https://jwt.io/)