#!/usr/bin/env bash

cd /srv/backup/www
git clone https://github.com/ImpressCMS/impresscms.git impresscms
cd impresscms
git fetch --all
git checkout retro
git remote set-url origin git@github.com:ImpressCMS/impresscms.git
composer install --no-interaction
chmod -R ug=rwx storage/ modules/
cp -r /tmp/data/impresscms/* -t /srv/backup/www/impresscms

cd ..
chown -R www-data impresscms
chgrp -R www-data impresscms
rar a -m5 -md512m -ow -r -s -t -tk -y -rr -k -ep1 impresscms.rar impresscms/
rm -rf impresscms
