# **Requisitos:** 
 - Docker

### Desplegar recursos:
```
docker compose up --build -d
```

### Destruir recursos:
```
docker compose down --rmi all --remove-orphans -v
```

## Bitácora:


1. ~~El metricbeat debe esperar a que Kibana termine de desplegarse y este disponible, es por eso que es muy probable que el contenedor de metricbeat no se levante con el docker compose up --build -d, es por eso que es necesario esperar a que kibana este disponible y ejecutar el comando~~: 
```
docker-compose restart metricbeat
```
2. Metricbeat funcional, se agregan healthchecks necesarios para esperar a los servicios de elasticsearch y kibana
3. Filebeat se instala dentro del contenedor Apollo Server una vez el stack ELK esté arriba, esto por medio del script de instalación almacenado en la ruta /opt/filebeat_resources/: 
```
docker exec apolloserver bash /opt/filebeat_resources/install.sh
```
    1. ingresar al contenedor: ```docker exec -it apolloserver bash```
    2. navegar a la ruta: ```cd /opt/filebeat_resources/```
    3. ejecutar el script: ```bash install.sh```
    4. verificar indice filebeat-7.9.1-2025: ```curl -XGET http://elasticsearch:9200/_cat/indices?v```