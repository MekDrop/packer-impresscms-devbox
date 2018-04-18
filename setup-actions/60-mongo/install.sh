#!/usr/bin/env bash

apt-get -q -y install php-mongo mongodb-org
service mongod start
