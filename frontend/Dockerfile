# Étape 1 : construire l'application Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Construire sans accès externe (pas de fonts Google en ligne)
RUN npm run build -- --configuration production --optimization=true

# Étape 2 : servir l'application avec Nginx
FROM nginx:alpine
COPY --from=build /app/dist/ecoplateform-app/browser  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
