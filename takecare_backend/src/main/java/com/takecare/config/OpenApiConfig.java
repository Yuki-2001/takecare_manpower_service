package com.takecare.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI takecareOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Takecare HR API")
                        .description("REST API for Takecare HR Candidate Management System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Takecare Team")
                                .url("https://takecare.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}