package com.Go_Work.Go_Work.Service;

import com.Go_Work.Go_Work.Entity.Token;
import com.Go_Work.Go_Work.Repo.TokenRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepo tokenRepo;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {

        final String authHeader = request.getHeader("Authorization");

        if ( authHeader == null || !authHeader.startsWith("Bearer") ){

            return;

        }

        final String jwtToken = authHeader.substring(7);

        Token storedToken = tokenRepo.findByToken(jwtToken).orElse(null);

        if ( storedToken != null ) {

            storedToken.setExpired(true);
            storedToken.setRevoked(true);

            tokenRepo.save(storedToken);

        }

    }

}