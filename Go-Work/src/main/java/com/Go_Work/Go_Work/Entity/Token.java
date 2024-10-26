package com.Go_Work.Go_Work.Entity;

import com.Go_Work.Go_Work.Entity.Enum.TokenType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "go_work_token_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Token {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Column(
            length = 1024
    )
    private String token;

    @Enumerated(EnumType.STRING)
    private TokenType tokenType;

    @NotNull
    private boolean expired;

    @NotNull
    private boolean revoked;

    @ManyToOne(
            cascade = CascadeType.ALL
    )
    @JoinColumn(
            name = "go_work_user_id"
    )
    @JsonBackReference
    private User goWorkUser;

}