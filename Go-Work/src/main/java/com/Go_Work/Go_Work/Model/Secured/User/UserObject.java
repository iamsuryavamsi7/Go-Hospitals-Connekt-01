package com.Go_Work.Go_Work.Model.Secured.User;

import com.Go_Work.Go_Work.Entity.Role.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserObject {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;

}
