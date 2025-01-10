package com.Go_Work.Go_Work.Entity;

import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(
        name = "go_work_users",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "email"
                }
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull(message = "firstName is required")
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    @Email
    private String email;

    @NotNull
    private String password;

    @NotNull
    private boolean unLocked;

    private Date registeredOn;

    private int otpCode;

    @OneToMany(
            mappedBy = "goWorkUser",
            cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Token> tokens = new ArrayList<>();

    @OneToMany(
            mappedBy = "medicalSupportUser",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference("medical-application")
    private List<Applications> applications = new ArrayList<>();

    @OneToMany(
            mappedBy = "teleSupportUser",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference("tele-support-application")
    private List<Applications> teleSupportApplications = new ArrayList<>();

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference
    private List<Notification> notifications = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
