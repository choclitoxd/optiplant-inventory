package com.optiplant.inventory;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Test de integración del contexto de Spring Boot.
 * Requiere una base de datos activa (PostgreSQL) — se ejecuta
 * en el pipeline de CI/CD con docker-compose, no en la suite de unit tests.
 */
@SpringBootTest
@Disabled("Requiere BD activa. Ejecutar con: docker compose up --build")
class OptiplantApplicationTests {

    @Test
    void contextLoads() {
    }

}
