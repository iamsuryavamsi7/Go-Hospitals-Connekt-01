package com.Go_Work.Go_Work.Service.Auth;

import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Model.Auth.RegistrationRequestObject;
import com.Go_Work.Go_Work.Repo.UserRepo;
import com.Go_Work.Go_Work.Service.Email.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    private final EmailSenderService emailSenderService;

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

}