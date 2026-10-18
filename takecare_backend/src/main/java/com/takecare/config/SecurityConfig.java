package com.takecare.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Value("${app.ui.url}")
	private String uiUrl;

	@SuppressWarnings("unused")
	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.cors(cors -> {
		}).csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**").permitAll().requestMatchers("/swagger")
						.permitAll().requestMatchers("/swagger-ui/**").permitAll().requestMatchers("/actuators/**")
						.permitAll().requestMatchers("/v3/**").permitAll().requestMatchers("/actuator/logfile")
						.permitAll()

						.anyRequest().authenticated())

				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.headers(headers -> headers.frameOptions(frame -> frame.disable()));
		return http.build();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

		// ------------------------------------------------
		// DEFAULT CORS (secured frontend only)
		// ------------------------------------------------
		CorsConfiguration defaultConfig = new CorsConfiguration();

		defaultConfig.setAllowedOrigins(List.of(uiUrl));
		defaultConfig.setAllowedMethods(List.of("*"));
		defaultConfig.setAllowedHeaders(List.of("*"));
		defaultConfig.setAllowCredentials(true);

		defaultConfig.setExposedHeaders(List.of("Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"));

		source.registerCorsConfiguration("/**", defaultConfig);

		// ------------------------------------------------
		// VIDEO STREAM CORS (allow all)
		// ------------------------------------------------
		CorsConfiguration streamConfig = new CorsConfiguration();

		streamConfig.setAllowedOriginPatterns(List.of("*"));
		streamConfig.setAllowedMethods(List.of("*"));
		streamConfig.setAllowedHeaders(List.of("*"));
		streamConfig.setAllowCredentials(false);

		streamConfig.setExposedHeaders(List.of("Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"));

		source.registerCorsConfiguration("/lms-program/stream/**", streamConfig);

		return source;
	}

}