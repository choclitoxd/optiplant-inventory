# Stage 1: Build (Compilación)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Caché de dependencias (optimiza futuras compilaciones)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compilar código fuente
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime (Producción)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiamos solo el JAR compilado de la etapa anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
