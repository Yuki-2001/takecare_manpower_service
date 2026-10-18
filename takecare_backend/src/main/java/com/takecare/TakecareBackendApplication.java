package com.takecare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
	info = @Info(
		title = "Takecare HR API",
		version = "1.0.0",
		description = "REST API for Takecare HR Candidate Management System"
	)
)
public class TakecareBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TakecareBackendApplication.class, args);
	}

}
