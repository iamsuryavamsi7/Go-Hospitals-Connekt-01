package com.Go_Work.Go_Work.Controller.Secured.ADMIN;

import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Service.Secured.ADMIN.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/fetchLockedUsers")
    public ResponseEntity<List<UserObject>> fetchUnlockedUsers(){

        List<UserObject> fetchedUserObjects = adminService.fetchLockedUsers();

        return ResponseEntity.ok(fetchedUserObjects);

    }

    @GetMapping("/acceptUserRequest/{userId}")
    public ResponseEntity<String> acceptUserById(
            @PathVariable("userId") Long userId
    ){

        String acceptedMessage = adminService.acceptUserById(userId);

        return ResponseEntity.ok(acceptedMessage);

    }

    @GetMapping("/deleteUserRequest/{userId}")
    public ResponseEntity<String> deleteUserById(
            @PathVariable("userId") Long userId
    ){

        String deletedMessage = adminService.deleteUserById(userId);

        return ResponseEntity.ok(deletedMessage);

    }

    @PostMapping("/addDoctor")
    public ResponseEntity<String> addDoctor(
            @RequestBody Doctor doctor
    ){

        String doctorAdded = adminService.addDoctor(doctor);

        return ResponseEntity.ok(doctorAdded);

    }

    @DeleteMapping("/deleteDoctor/{doctorId}")
    public ResponseEntity<String> deleteDoctor(
            @PathVariable("doctorId") Long doctorId
    ){

        String doctorAdded = adminService.deleteDoctor(doctorId);

        return ResponseEntity.ok(doctorAdded);

    }

}
