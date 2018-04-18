#!/usr/bin/env bash

cat >> /etc/network/interfaces <<EOF
auto eth0
iface eth0 inet dhcp
auto eth1
iface eth1 inet manual
EOF
