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
    1. ejecutar el script dentro del contenedor: ```docker exec apolloserver bash /opt/filebeat_resources/install.sh```
    2. verificar indice filebeat-7.9.1-2025:
        1. fuera del contenedor: ```curl -XGET http://localhost:9200/_cat/indices?v```
        2. dentro del contenedor: ```docker exec apolloserver curl -XGET http://elasticsearch:9200/_cat/indices?v```