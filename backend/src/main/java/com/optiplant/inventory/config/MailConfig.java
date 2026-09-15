package com.optiplant.inventory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableAsync
@EnableScheduling
public class MailConfig {
    // La configuración de JavaMailSender se inyecta automáticamente gracias a spring-boot-starter-mail 
    // y las propiedades definidas en application.yml
}
