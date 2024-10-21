package com.Go_Work.Go_Work.Service.Secured.ADMIN;

import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Repo.DoctorRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
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
public class AdminService {

    private final UserRepo userRepo;

    private final DoctorRepo doctorRepo;

    private final EmailSenderService emailSenderService;

    public List<UserObject> fetchLockedUsers() {

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

    public String deleteUserById(Long userId) {

        userRepo.deleteById(userId);

        return "User Deleted";

    }

    public String addDoctor(Doctor doctor) {

        doctorRepo.save(doctor);

        return "User Saved";

    }

    public String deleteDoctor(Long doctorId) {

        doctorRepo.deleteById(doctorId);

        return "User Saved";

    }

}
