#!/usr/bin/env bash

apt-get -q -y install apache2 apache2-utils
pushd /etc/apache2/sites-available/
    a2dissite *
popd
a2enmod rewrite alias mime mime_magic ssl dir env status
