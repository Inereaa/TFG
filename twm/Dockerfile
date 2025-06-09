
FROM php:8.2-apache

# Instalar extensiones necesarias para Symfony
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_mysql zip

# Habilitar mod_rewrite para Apache
RUN a2enmod rewrite
RUN a2enmod ssl

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar el archivo de configuración de Apache
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

# Copiar el proyecto de Symfony
COPY . .

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instalar dependencias PHP
RUN composer install --optimize-autoloader

# Permisos necesarios
RUN chown -R www-data:www-data /var/www/html/var /var/www/html/vendor

# Certificados
COPY ../tf/certificate.crt /etc/ssl/certs/certificate.crt
COPY ../tf/ca_bundle.crt /etc/ssl/certs/ca_bundle.crt
COPY ../tf/private.key /etc/ssl/private/private.key

EXPOSE 80 443

CMD ["apache2-foreground"]
