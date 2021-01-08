#!/bin/sh

rm -f /tmp/.X99-lock
Xvfb :99 -screen 0 1600x1200x24 &
export DISPLAY=:99
chromedriver --whitelisted-ips --verbose
