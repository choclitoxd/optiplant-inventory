package com.optiplant.inventory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI inventoryOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Sistema de Inventario Multi-Sucursal")
                        .description("Documentación oficial de los endpoints REST para el Sistema de Inventario Multi-Sucursal (Prueba Técnica).")
                        .version("1.0.0"));
    }
}
