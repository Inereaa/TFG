
FROM php:8.2-apache

# Instalar extensiones necesarias para Symfony
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_mysql zip

# Habilitar mod_rewrite para Apache
RUN a2enmod rewrite

WORKDIR /var/www/html

# Copiar el proyecto de Symfony
COPY . .

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instalar dependencias PHP
RUN composer install --optimize-autoloader

# Permisos necesarios
RUN chown -R www-data:www-data /var/www/html/var /var/www/html/vendor

EXPOSE 80

CMD ["apache2-foreground"]
