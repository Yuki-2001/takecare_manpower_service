package com.takecare.config;

import java.util.Date;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String jwtSecret = "TakeCare20261019TakeCare20261019";
	private final long jwtExpirationMs = 1000 * 60 * 60 * 24 * 7; // 7 days

//    private final SecretKey key = Keys.hmacShaKeyFor("LMSNexInfo20251227LMSNexInfo20251227");

//    public JwtUtil(@Value("${jwt.secret}") String secret) {
//        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
//    }

	public String generateToken(String username) {

		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
				.signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS256).compact();
	}

	public String getUsernameFromToken(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(jwtSecret.getBytes()).build().parseClaimsJws(token)
				.getBody();

		return claims.getSubject();
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		return Jwts.parserBuilder().setSigningKey(jwtSecret.getBytes()).build().parseClaimsJws(token).getBody()
				.getSubject().equals(userDetails.getUsername());
	}
}
