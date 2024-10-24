package com.Go_Work.Go_Work.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "notifications_table"
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String message; // Notification message

    private Date timeStamp; // Timestamp of when the notification was created

    private Long applicationId;

    private boolean isRead; // Flag to indicate if the notification has been read

    @ManyToOne
    @JoinColumn(
            name = "user_id"
    )
    @JsonBackReference
    private User user;

}
