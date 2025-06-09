
# Build
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Producción - para nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Certificados
COPY ./certs/certificate.crt /etc/ssl/certs/certificate.crt
COPY ./certs/ca_bundle.crt /etc/ssl/certs/ca_bundle.crt
COPY ./certs/private.key /etc/ssl/private/private.key

# Copiar configuración de Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
