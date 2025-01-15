# Solid Pod Server Setup

This is a Docker configuration for running a Solid Pod server on a Synology NAS.

## Prerequisites

1. Synology NAS with Docker installed
2. Domain name (eidotter.com) with DNS configured
3. SSL certificate for pod.eidotter.com

## Setup Instructions

1. Create required directories on your NAS:
   ```bash
   mkdir -p /volume1/docker/solid-pod/{data,config}
   ```

2. Copy these files to your NAS:
   - Dockerfile
   - docker-compose.yml
   - config/config.json

3. Configure SSL:
   - Set up SSL certificate for pod.eidotter.com in Synology's Control Panel
   - Configure reverse proxy in Synology's Application Portal:
     - Source: https://pod.eidotter.com
     - Destination: http://solid-pod:3000
     - Enable HTTPS and set up SSL certificate

4. Update email settings:
   - Edit config/config.json
   - Update SMTP settings for your email provider
   - Add SMTP password as an environment variable in docker-compose.yml

5. Start the server:
   ```bash
   docker-compose up -d
   ```

6. Create your admin account:
   - Visit https://pod.eidotter.com
   - Register with your @eidotter.com email

## Configuration

The server is configured to:
- Run on port 3000 internally
- Use file-based storage in /app/data
- Allow registration only for @eidotter.com emails
- Enable WebID-based authentication

## Maintenance

- Logs: `docker logs solid-pod`
- Restart: `docker-compose restart`
- Update: 
  ```bash
  docker-compose down
  docker-compose pull
  docker-compose up -d
  ```

## Backup

The important directories to backup are:
- /volume1/docker/solid-pod/data (Pod data)
- /volume1/docker/solid-pod/config (Server configuration)

Configure Synology's Hyper Backup to include these directories. 