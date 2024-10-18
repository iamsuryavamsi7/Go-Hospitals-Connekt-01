package com.Go_Work.Go_Work.Controller.Auth;

import com.Go_Work.Go_Work.Error.PasswordsNotMatchException;
import com.Go_Work.Go_Work.Model.Auth.RegistrationRequestObject;
import com.Go_Work.Go_Work.Service.Auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registration(
            @RequestBody RegistrationRequestObject request
    ) throws PasswordsNotMatchException {

        if ( request.getPassword().equals(request.getConformPassword()) ){

            String userCreatedMessage = authService.doRegister(request);

            return ResponseEntity.ok(userCreatedMessage);

        }else {

            throw new PasswordsNotMatchException("\n\n\nPasswords Not Matched\n\n\n");

        }

    }

}
