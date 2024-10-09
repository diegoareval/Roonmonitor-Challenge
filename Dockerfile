# Use an official Node.js runtime as the base image
FROM node:16.14.0-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package*.json yarn.lock ./

# Install the dependencies
RUN yarn install --frozen-lockfile

# Copy the remaining files to the container
COPY . .

# Specify the environment variables
ENV DATABASE_URL=<database_url>
ENV JWT_SECRET=<jwt_secret>

# Run Prisma migrations
# RUN npx prisma migrate--experimental && npx prisma migrate up --experimental

# Expose the app on port 3000
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
