package com.Go_Work.Go_Work.Model.Auth;

import com.Go_Work.Go_Work.Entity.Enum.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRoleModel {

    private Role role;

}
