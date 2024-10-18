package com.Go_Work.Go_Work.Config;

import com.Go_Work.Go_Work.Repo.TokenRepo;
import com.Go_Work.Go_Work.Service.Config.JwtService;
import com.Go_Work.Go_Work.Service.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilterChain extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final MyUserDetailsService myUserDetailsService;

    private final TokenRepo tokenRepo;

    @Override
    protected void doFilterInternal(
            @NonNull  HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if ( authHeader == null || !authHeader.startsWith("Bearer ") ) {

            filterChain.doFilter(request, response);

            return;

        }

        final String jwtToken = authHeader.substring(7);

        final String userEmail = jwtService.extractUserName(jwtToken);

        if ( userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null ) {

            UserDetails userDetails = myUserDetailsService.loadUserByUsername(userEmail);

            boolean isTokenValid = tokenRepo.findByToken(jwtToken)
                    .map(token -> !token.isExpired() && !token.isRevoked())
                    .orElse(false);

            if ( jwtService.isTokenValid(jwtToken, userDetails) && isTokenValid  ) {

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);

            }

        }

        filterChain.doFilter(request, response);

    }

}
