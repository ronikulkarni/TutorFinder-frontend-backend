package net.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // ✅ Allow all API endpoints
                        .allowedOrigins("*") // ✅ Allow frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // ✅ Include OPTIONS for preflight
                        .allowedHeaders("*") // ✅ Allow all headers
                        .allowCredentials(true); // ✅ Required if authentication is needed
            }
        };
    }
}