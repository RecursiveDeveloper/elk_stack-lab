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
3. Filebeat funcional, se configura para recoger datos del contenedor que aloja al servidor Apollo Server 
    1. verificar indice filebeat-7.9.1-2025: http://localhost:9200/_cat/indices?v