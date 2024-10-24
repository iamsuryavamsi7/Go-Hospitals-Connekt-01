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
        name = "applications_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Applications {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private int age;
    private String contact;
    private String address;
    private String gender;
    private String medicalHistory;
    private String reasonForVisit;
    private String preferredDoctorName;
    private String billNo;
    private Date appointmentCreatedOn;
    private boolean appointmentFinished;
    private String bookedBy;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(
            name = "medical_support_user_id"
    )
    private User medicalSupportUser;

}
