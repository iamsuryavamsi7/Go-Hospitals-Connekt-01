package com.Go_Work.Go_Work.Service.Secured.User;

import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Repo.UserRepo;
import com.Go_Work.Go_Work.Service.Config.JwtService;
import com.Go_Work.Go_Work.Service.Email.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;

    private final JwtService jwtService;

    private final EmailSenderService emailSenderService;

    public UserObject fetchUserObject(String jwtToken) {

        String extractedUserName = jwtService.extractUserName(jwtToken);

        Optional<User> fetchedUser = userRepo.findByEmail(extractedUserName);

        if ( fetchedUser.isPresent() ){

            User user = fetchedUser.get();

            UserObject newUser = new UserObject();

            BeanUtils.copyProperties(user, newUser);

            return newUser;

        }else{

            throw new UsernameNotFoundException("User Not Found");

        }

    }

    public List<UserObject> fetchUnlockedUsers() {

        return userRepo.findAll()
                .stream()
                .filter(user -> !user.isUnLocked() )
                .map(fetchedUser -> {

                    UserObject fetchedUser1 = new UserObject();

                    BeanUtils.copyProperties(fetchedUser, fetchedUser1);

                    return fetchedUser1;

                })
                .collect(Collectors.toList());

    }

    public String deleteUserById(Long userId) {

        userRepo.deleteById(userId);

        return "User Deleted";

    }

    @Async
    private void sendRegistrationEmail(String email) {
        emailSenderService.sendSimpleEmail(
                email,
                "\n\nYour registration is been updated. Please wait for approval from your admin\n\n",
                "Registration Approved"
        );
    }

    public String acceptUserById(Long userId) {

        Optional<User> fetchedUser = userRepo.findById(userId);

        if ( fetchedUser.isPresent() ){

            User user = fetchedUser.get();

            user.setUnLocked(true);

            userRepo.save(user);

            sendRegistrationEmail(user.getEmail());

            return "User Accepted";

        }

        throw new UsernameNotFoundException("User Not Found");

    }

}
