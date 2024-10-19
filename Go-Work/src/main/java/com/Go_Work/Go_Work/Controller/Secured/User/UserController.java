package com.Go_Work.Go_Work.Controller.Secured.User;

import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Service.Secured.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/fetchUserObject")
    public ResponseEntity<UserObject> fetchUserObject(
            @RequestParam("jwtToken") String jwtToken
    ){

        UserObject fetchedUserObject = userService.fetchUserObject(jwtToken);

        return ResponseEntity.ok(fetchedUserObject);

    }

    @GetMapping("/fetchUnlockedUsers")
    public ResponseEntity<List<UserObject>> fetchUnlockedUsers(){

        List<UserObject> fetchedUserObjects = userService.fetchUnlockedUsers();

        return ResponseEntity.ok(fetchedUserObjects);

    }

    @GetMapping("/deleteUserRequest/{userId}")
    public ResponseEntity<String> deleteUserById(
            @PathVariable("userId") Long userId
    ){

        String deletedMessage = userService.deleteUserById(userId);

        return ResponseEntity.ok(deletedMessage);

    }

    @GetMapping("/acceptUserRequest/{userId}")
    public ResponseEntity<String> acceptUserById(
            @PathVariable("userId") Long userId
    ){

        String acceptedMessage = userService.acceptUserById(userId);

        return ResponseEntity.ok(acceptedMessage);

    }

}
