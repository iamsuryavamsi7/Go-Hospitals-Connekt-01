package com.Go_Work.Go_Work.Service.Auth;

import com.Go_Work.Go_Work.Entity.Role.Role;
import com.Go_Work.Go_Work.Entity.Role.TokenType;
import com.Go_Work.Go_Work.Entity.Token;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Model.Auth.AuthenticationRequestObject;
import com.Go_Work.Go_Work.Model.Auth.AuthenticationResponseObject;
import com.Go_Work.Go_Work.Model.Auth.RegistrationRequestObject;
import com.Go_Work.Go_Work.Repo.TokenRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import com.Go_Work.Go_Work.Service.Config.JwtService;
import com.Go_Work.Go_Work.Service.Email.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountLockedException;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;

    private final TokenRepo tokenRepo;

    private final PasswordEncoder passwordEncoder;

    private final EmailSenderService emailSenderService;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    @Async
    private void sendRegistrationEmail(String email) {
        emailSenderService.sendSimpleEmail(
                email,
                "\n\nYou have been registered successfully. Please wait for approval from your admin\n\n",
                "Registration Successful"
        );
    }

    public String doRegister(RegistrationRequestObject request) {

        User savingUserObject = new User();

        BeanUtils.copyProperties(request, savingUserObject);

        savingUserObject.setRegisteredOn(new Date(System.currentTimeMillis()));

        savingUserObject.setPassword(passwordEncoder.encode(request.getPassword()));

        savingUserObject.setUnLocked(false);

        userRepo.save(savingUserObject);

        sendRegistrationEmail(savingUserObject.getEmail());

        return "User Successfully Created";

    }

    private void saveToken(String accessToken, User user){

        Token token = Token.builder()
                .token(accessToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .goWorkUser(user)
                .build();

        tokenRepo.save(token);

    }

    private void revokeUserTokens(User user){

        List<Token> validUserTokens = tokenRepo.findAllValidTokensByUser(user.getId());

        if ( validUserTokens.isEmpty() ){

            return;

        }

        validUserTokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
        });

        tokenRepo.saveAll(validUserTokens);

    }

    public AuthenticationResponseObject authenticateFrontDesk(AuthenticationRequestObject request) throws AccountLockedException {

        User fetchedUser = userRepo.findByEmail(request.getEmail()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if ( fetchedUser.isUnLocked() && fetchedUser.getRole() == Role.FRONTDESK ){

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String jwtToken = jwtService.generateToken(fetchedUser, fetchedUser);

            revokeUserTokens(fetchedUser);

            saveToken(jwtToken, fetchedUser);

            return AuthenticationResponseObject.builder()
                    .accessToken(jwtToken)
                    .build();

        } else {

            throw new AccountLockedException("Account Locked");

        }

    }

    public AuthenticationResponseObject authenticateMedicalSupport(AuthenticationRequestObject request) throws AccountLockedException {

        User fetchedUser = userRepo.findByEmail(request.getEmail()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if ( fetchedUser.isUnLocked() && fetchedUser.getRole() == Role.MEDICALSUPPORT ){

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String jwtToken = jwtService.generateToken(fetchedUser, fetchedUser);

            revokeUserTokens(fetchedUser);

            saveToken(jwtToken, fetchedUser);

            return AuthenticationResponseObject.builder()
                    .accessToken(jwtToken)
                    .build();

        } else {

            throw new AccountLockedException("Account Locked");

        }

    }

    public AuthenticationResponseObject authenticateTeleSupport(AuthenticationRequestObject request) throws AccountLockedException {

        User fetchedUser = userRepo.findByEmail(request.getEmail()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if ( fetchedUser.isUnLocked() && fetchedUser.getRole() == Role.TELESUPPORT ){

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String jwtToken = jwtService.generateToken(fetchedUser, fetchedUser);

            revokeUserTokens(fetchedUser);

            saveToken(jwtToken, fetchedUser);

            return AuthenticationResponseObject.builder()
                    .accessToken(jwtToken)
                    .build();

        } else {

            throw new AccountLockedException("Account Locked");

        }

    }

    public AuthenticationResponseObject authenticatePharmacyCare(AuthenticationRequestObject request) throws AccountLockedException {

        User fetchedUser = userRepo.findByEmail(request.getEmail()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if ( fetchedUser.isUnLocked() && fetchedUser.getRole() == Role.PHARMACYCARE ){

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String jwtToken = jwtService.generateToken(fetchedUser, fetchedUser);

            revokeUserTokens(fetchedUser);

            saveToken(jwtToken, fetchedUser);

            return AuthenticationResponseObject.builder()
                    .accessToken(jwtToken)
                    .build();

        } else {

            throw new AccountLockedException("Account Locked");

        }

    }

    public AuthenticationResponseObject authenticateOtCoordination(AuthenticationRequestObject request) throws AccountLockedException {

        User fetchedUser = userRepo.findByEmail(request.getEmail()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if ( fetchedUser.isUnLocked() && fetchedUser.getRole() == Role.OTCOORDINATION ){

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String jwtToken = jwtService.generateToken(fetchedUser, fetchedUser);

            revokeUserTokens(fetchedUser);

            saveToken(jwtToken, fetchedUser);

            return AuthenticationResponseObject.builder()
                    .accessToken(jwtToken)
                    .build();

        } else {

            throw new AccountLockedException("Account Locked");

        }

    }

    public AuthenticationResponseObject authenticateDiagnosticsCenter(AuthenticationRequestObject request) throws AccountLockedException {

        User fetchedUser = userRepo.findByEmail(request.getEmail()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if ( fetchedUser.isUnLocked() && fetchedUser.getRole() == Role.DIAGNOSTICSCENTER ){

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String jwtToken = jwtService.generateToken(fetchedUser, fetchedUser);

            revokeUserTokens(fetchedUser);

            saveToken(jwtToken, fetchedUser);

            return AuthenticationResponseObject.builder()
                    .accessToken(jwtToken)
                    .build();

        } else {

            throw new AccountLockedException("Account Locked");

        }

    }

    public AuthenticationResponseObject authenticateTransportTeam(AuthenticationRequestObject request) throws AccountLockedException {

        User fetchedUser = userRepo.findByEmail(request.getEmail()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if ( fetchedUser.isUnLocked() && fetchedUser.getRole() == Role.TRANSPORTTEAM ){

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String jwtToken = jwtService.generateToken(fetchedUser, fetchedUser);

            revokeUserTokens(fetchedUser);

            saveToken(jwtToken, fetchedUser);

            return AuthenticationResponseObject.builder()
                    .accessToken(jwtToken)
                    .build();

        } else {

            throw new AccountLockedException("Account Locked");

        }

    }
}