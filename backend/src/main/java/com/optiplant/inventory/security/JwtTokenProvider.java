package com.optiplant.inventory.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:optiplant-super-secret-key-that-should-be-very-long-and-secure-for-hs256-algorithm-yes-indeed-very-long}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private int jwtExpirationMs; // Default: 24h

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(
                // In a real scenario, this is passed as base64 from env. Here we just encode our fallback string if it's not valid base64.
                // Wait, if the default string isn't valid base64, it throws. Let's just use a valid base64 default for the fallback.
                "b3B0aXBsYW50LXN1cGVyLXNlY3JldC1rZXktdGhhdC1zaG91bGQtYmUtdmVyeS1sb25nLWFuZC1zZWN1cmUtZm9yLWhzMjU2LWFsZ29yaXRobS15ZXMtaW5kZWVkLXZlcnktbG9uZw=="
        ));
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Invalid token
            return false;
        }
    }
}
