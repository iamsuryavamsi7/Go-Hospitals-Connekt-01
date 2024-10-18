package com.Go_Work.Go_Work.Model.Auth;

import com.Go_Work.Go_Work.Entity.Role.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequestObject {

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    @Email
    private String email;

    @NotNull
    private String password;

    @NotNull
    private String conformPassword;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Role role;

}
