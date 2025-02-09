Requisitos: docker, docker compose

Desplegar recursos:
docker compose up --build -d

Destruir recursos:
docker compose down --rmi all --remove-orphans


El metricbeat debe esperar a que Kibana termine de desplegarse y este disponible, es por eso que es muy probable que 
el contenedor de metricbeat no se levante con el docker compose up --build -d, es por eso que es necesario esperar a que kibana este disponible
y ejecutar el comando:
docker-compose restart metricbeat