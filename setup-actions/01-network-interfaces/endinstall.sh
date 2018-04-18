#!/usr/bin/env bash

echo "pre-up sleep 2" >> /etc/network/interfaces

echo "Making sure Udev doesn't block our network..."
rm /etc/udev/rules.d/70-persistent-net.rules
mkdir /etc/udev/rules.d/70-persistent-net.rules
rm -rf /dev/.udev/
rm /lib/udev/rules.d/75-persistent-net-generator.rules
