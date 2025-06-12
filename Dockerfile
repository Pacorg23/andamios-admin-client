# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build --prod

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Borra el contenido default del nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos del build al html de nginx
COPY --from=build /app/dist/app-andamios-admin/browser /usr/share/nginx/html

# Copia configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

