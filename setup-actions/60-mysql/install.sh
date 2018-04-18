#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive
apt-get -q -y install mysql-server mysql-client mysqltuner php-mysqlnd
