#! /bin/sh

mosquitto_sub -h brazil.thethings.network -t "+/devices/+/up" -u 'greatway-test' -P 'ttn-account-v2.DPJ83OzXhKXzVJ278Z7VGRnkT58daccikh3jJQvFaE0' -v | ruby simula_dado_chegando.rb
