package com.Go_Work.Go_Work.Service.Config;

import com.Go_Work.Go_Work.Entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.secret-key}")
    private String secretKey;

    @Value("${application.security.access_token.expiration}")
    private int access_token_expiration;

    private SecretKey getSignInKey() {

        return Keys.hmacShaKeyFor(secretKey.getBytes());

    }

    private Object populateAuthorities(Collection<? extends GrantedAuthority> authorities) {

        Set<String> authoritiesSet = new HashSet<>();

        for ( GrantedAuthority authority: authorities ) {

            authoritiesSet.add(authority.getAuthority());

        }

        return String.join(",", authoritiesSet);

    }

    public String generateToken(UserDetails userDetails, User user){

        return Jwts.builder()
                .claim("Authorities", populateAuthorities(userDetails.getAuthorities()))
                .claim("IsUnlocked", user.isUnLocked())
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + access_token_expiration))
                .signWith(getSignInKey())
                .compact();

    }

    public Claims extractAllClaims(String jwtToken){

        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();

    }

    public <T> T extractClaim(String jwtToken, Function<Claims, T> claimsTFunction){

        Claims extracedClaims = extractAllClaims(jwtToken);

        return claimsTFunction.apply(extracedClaims);

    }

    public String extractUserName(String jwtToken) {

        return extractClaim(jwtToken, Claims::getSubject);

    }

    public boolean isTokenValid(String jwtToken, UserDetails userDetails) {

        String userEmail = extractUserName(jwtToken);

        Date expiration = extractClaim(jwtToken, Claims::getExpiration);

        return userEmail.equals(userDetails.getUsername()) && expiration.after(new Date(System.currentTimeMillis()));

    }

}
