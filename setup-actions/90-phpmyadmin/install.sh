#!/usr/bin/env bash

apt-get -q -y install phpmyadmin
phpenmod mcrypt
ln -s /etc/phpmyadmin/apache.conf /etc/apache2/mods-enabled/phpmyadmin.conf
a2enmod phpmyadmin
