#!/usr/bin/env bash

rm -rf /var/www/html
mkdir -p /vagrant
mkdir -p /vagrant/www
mkdir -p /vagrant/www/htdocs
ln -s /vagrant/www/htdocs /var/www/html

mkdir -p /srv/www
usermod -a -G www-data vagrant

chown -R www-data /srv/www
chgrp -R www-data /srv/www

chown -R vagrant /vagrant/www
chgrp -R vagrant /vagrant/www
