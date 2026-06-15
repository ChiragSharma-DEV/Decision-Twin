FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Set node env to production
ENV NODE_ENV=production

# Expose default port just in case (Cloud Run overrides this)
EXPOSE 3000

CMD ["npm", "start"]
