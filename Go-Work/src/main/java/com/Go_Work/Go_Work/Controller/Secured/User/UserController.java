package com.Go_Work.Go_Work.Controller.Secured.User;

import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Service.Secured.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
