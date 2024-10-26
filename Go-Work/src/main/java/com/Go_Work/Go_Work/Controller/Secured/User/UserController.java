package com.Go_Work.Go_Work.Controller.Secured.User;

import com.Go_Work.Go_Work.Entity.User;
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

    @PostMapping("/fetchUserObjectFull")
    public ResponseEntity<User> fetchUserObjectFull(
            @RequestParam("jwtToken") String jwtToken
    ){

        User fetchedUserObject = userService.fetchUserObjectFull(jwtToken);

        return ResponseEntity.ok(fetchedUserObject);

    }

}
