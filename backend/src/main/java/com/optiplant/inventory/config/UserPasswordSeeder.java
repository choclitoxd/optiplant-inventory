package com.optiplant.inventory.config;

import com.optiplant.inventory.domain.entity.User;
import com.optiplant.inventory.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * ponytail: Utiliza CommandLineRunner para inyectar contraseñas cifradas usando el backend, 
 * sin necesidad de reescribir todo el data.sql en Java y sin romper las Foreign Keys.
 */
@Component
public class UserPasswordSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(UserPasswordSeeder.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserPasswordSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        List<User> users = userRepository.findAll();
        boolean updated = false;

        for (User user : users) {
            // Check if password needs encoding (e.g. from data.sql seed without bcrypt)
            if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
                logger.info("Encoding password for user: {}", user.getUsername());
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
                updated = true;
            }
        }
        
        if (updated) {
            logger.info("User passwords have been successfully encoded by the backend.");
        }
    }
}
