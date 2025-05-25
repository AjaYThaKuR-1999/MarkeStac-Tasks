FROM node:20-slim
WORKDIR /app
RUN echo "Starting to install dependencies..."
COPY package*.json ./
RUN echo "Finished installing dependencies."
RUN npm install --only=production
RUN echo "Copying project files into the container..."
COPY . .
EXPOSE 5101
CMD [ "npm", "start" ]