package com.Go_Work.Go_Work.Controller.Auth;

import com.Go_Work.Go_Work.Error.PasswordsNotMatchException;
import com.Go_Work.Go_Work.Model.Auth.AuthenticationRequestObject;
import com.Go_Work.Go_Work.Model.Auth.AuthenticationResponseObject;
import com.Go_Work.Go_Work.Model.Auth.RegistrationRequestObject;
import com.Go_Work.Go_Work.Service.Auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.security.auth.login.AccountLockedException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registration(
            @Valid @RequestBody RegistrationRequestObject request
    ) throws PasswordsNotMatchException {

        if ( request.getPassword().equals(request.getConformPassword()) ){

            String userCreatedMessage = authService.doRegister(request);

            return ResponseEntity.ok(userCreatedMessage);

        }else {

            throw new PasswordsNotMatchException("\n\n\nPasswords Not Matched\n\n\n");

        }

    }

    @PostMapping("/authenticate-front-desk")
    public ResponseEntity<AuthenticationResponseObject> authenticateFrontDesk(
            @Valid  @RequestBody AuthenticationRequestObject request
    ) throws AccountLockedException {

        AuthenticationResponseObject userAuthenticatedMessage = authService.authenticateFrontDesk(request);

        return ResponseEntity.ok(userAuthenticatedMessage);

    }

    @PostMapping("/authenticate-medical-support")
    public ResponseEntity<AuthenticationResponseObject> authenticateMedicalSupport(
            @Valid  @RequestBody AuthenticationRequestObject request
    ) throws AccountLockedException {

        AuthenticationResponseObject userAuthenticatedMessage = authService.authenticateMedicalSupport(request);

        return ResponseEntity.ok(userAuthenticatedMessage);

    }

    @PostMapping("/authenticate-tele-support")
    public ResponseEntity<AuthenticationResponseObject> authenticateTeleSupport(
            @Valid  @RequestBody AuthenticationRequestObject request
    ) throws AccountLockedException {

        AuthenticationResponseObject userAuthenticatedMessage = authService.authenticateTeleSupport(request);

        return ResponseEntity.ok(userAuthenticatedMessage);

    }

    @PostMapping("/authenticate-pharmacy-care")
    public ResponseEntity<AuthenticationResponseObject> authenticatePharmacyCare(
            @Valid  @RequestBody AuthenticationRequestObject request
    ) throws AccountLockedException {

        AuthenticationResponseObject userAuthenticatedMessage = authService.authenticatePharmacyCare(request);

        return ResponseEntity.ok(userAuthenticatedMessage);

    }

    @PostMapping("/authenticate-ot-coordination")
    public ResponseEntity<AuthenticationResponseObject> authenticateOtCoordination(
            @Valid  @RequestBody AuthenticationRequestObject request
    ) throws AccountLockedException {

        AuthenticationResponseObject userAuthenticatedMessage = authService.authenticateOtCoordination(request);

        return ResponseEntity.ok(userAuthenticatedMessage);

    }

    @PostMapping("/authenticate-diagnostics-center")
    public ResponseEntity<AuthenticationResponseObject> authenticateDiagnosticsCenter(
            @Valid  @RequestBody AuthenticationRequestObject request
    ) throws AccountLockedException {

        AuthenticationResponseObject userAuthenticatedMessage = authService.authenticateDiagnosticsCenter(request);

        return ResponseEntity.ok(userAuthenticatedMessage);

    }

    @PostMapping("/authenticate-transport-team")
    public ResponseEntity<AuthenticationResponseObject> authenticateTransportTeam(
            @Valid  @RequestBody AuthenticationRequestObject request
    ) throws AccountLockedException {

        AuthenticationResponseObject userAuthenticatedMessage = authService.authenticateTransportTeam(request);

        return ResponseEntity.ok(userAuthenticatedMessage);

    }

}
