package com.takecare.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.takecare.service.AuthService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtService;

	private final AuthService authService;

	private static final List<String> PUBLIC_URLS_ALL = List.of("/api/auth", "/api/user", "/swagger-ui", "/v3","/actuator");
	private static final List<String> PUBLIC_URLS = List.of();

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getRequestURI();
		return (PUBLIC_URLS_ALL.stream().anyMatch(path::startsWith) || PUBLIC_URLS.stream().anyMatch(path::equals));
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");
		String token = null;
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {

			if (request.getCookies() != null) {
				for (Cookie c : request.getCookies()) {
					if ("ACCESS_TOKEN".equals(c.getName())) {
						token = c.getValue();
						break;
					}
				}
			}

			if (token == null) {
				filterChain.doFilter(request, response);
				return;
			}
		} else {
			token = authHeader.substring(7);
		}
		
		String username = jwtService.getUsernameFromToken(token);
		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

			UserDetails userDetails = authService.loadUserByUsername(username);

			if (jwtService.isTokenValid(token, userDetails)) {
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null,
						userDetails.getAuthorities());

				auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(auth);
			}
		}

		filterChain.doFilter(request, response);
	}
}
