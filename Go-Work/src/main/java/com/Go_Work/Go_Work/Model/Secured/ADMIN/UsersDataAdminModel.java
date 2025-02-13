package com.Go_Work.Go_Work.Model.Secured.ADMIN;

import com.Go_Work.Go_Work.Entity.Enum.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersDataAdminModel {

    private Long id;
    private String username;
    private Role role;

}
