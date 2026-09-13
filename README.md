# Sistema de Inventario Multi-Sucursal

Este es un sistema de gestión de inventario para múltiples sucursales, desarrollado como una aplicación Full Stack utilizando una arquitectura en 3 capas.

## Tecnologías Utilizadas

- **Frontend:** React, TypeScript, Vite
- **Backend:** Java, Spring Boot, API REST
- **Base de Datos:** PostgreSQL
- **Despliegue:** Docker y Docker Compose

## Estructura del Proyecto

El proyecto está dividido en los siguientes módulos principales:

- `frontend/`: Contiene la aplicación web desarrollada en React y TypeScript.
- `backend/`: Contiene la API REST desarrollada en Spring Boot.
- `docker/`: Scripts e inicialización de la base de datos PostgreSQL.
- `Diagramas/`: Diagramas de arquitectura, casos de uso, entidad-relación y actividades.

## Requisitos Previos

- Docker y Docker Compose instalados en tu máquina.
- Git.

## Instrucciones de Ejecución

El proyecto está dockerizado para facilitar su ejecución con un solo comando. Sigue estos pasos para levantarlo:

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd NuevaChamba
   ```

2. Configura las variables de entorno (si es necesario) copiando el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

3. Levanta todos los servicios utilizando Docker Compose:
   ```bash
   docker compose up -d
   ```

4. Accede a la aplicación:
   - **Frontend:** http://localhost:5173 (o el puerto configurado)
   - **Backend API:** http://localhost:8080/api

## Diseño y Arquitectura

Las decisiones de diseño y arquitectura se encuentran documentadas en los diagramas de la carpeta `Diagramas/` y en las reglas establecidas en el proyecto. 
El sistema garantiza un entorno autónomo de ejecución y sigue estrictamente principios como SOLID y normalización 3FN en la base de datos.
