#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive
apt-get -y -q install python-letsencrypt-apache

letsencrypt --apache --non-interactive -d impresscms.local

crontab -l > /tmp/crontab.lst
echo "0 0 1 * * /usr/bin/letsencrypt renew &> /dev/null" >> /tmp/crontab.lst
crontab /tmp/crontab.lst
rm /tmp/crontab.lst
