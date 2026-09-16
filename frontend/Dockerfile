# Stage 1: Build (Node.js)
FROM node:20-alpine AS build
WORKDIR /app

# Declaramos variables de entorno requeridas en tiempo de compilación (ej. para Vite)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Caché de dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Compilar aplicación React/TypeScript
COPY . .
RUN npm run build

# Stage 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copiamos la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiamos los estáticos generados por npm/vite
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto por defecto de Nginx
EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
