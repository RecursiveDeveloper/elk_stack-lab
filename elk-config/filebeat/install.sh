#!/bin/bash

apt update -y && apt install nano
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.9.1-amd64.deb
dpkg -i filebeat-7.9.1-amd64.deb

cp -f filebeat.yml /etc/filebeat/filebeat.yml

filebeat setup -e
service filebeat start
service filebeat status
filebeat setup --index-management -E 'output.elasticsearch.hosts=["elasticsearch:9200"]'