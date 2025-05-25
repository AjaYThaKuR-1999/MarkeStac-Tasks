FROM node:20-slim
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxrandr2 \
    libasound2 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libpangocairo-1.0-0 \
    libpangoft2-1.0-0 \
    libgbm1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN echo "Starting to install dependencies..."
COPY package*.json ./
RUN echo "Finished installing dependencies."
RUN npm install --only=production
RUN echo "Copying project files into the container..."
COPY . .
EXPOSE 6102
CMD [ "npm", "start" ]