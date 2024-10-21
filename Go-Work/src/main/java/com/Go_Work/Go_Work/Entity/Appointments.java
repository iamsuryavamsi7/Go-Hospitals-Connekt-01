package com.Go_Work.Go_Work.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "appointments_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointments {

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
    private Date appointmentCreatedOn;
    private boolean appointmentFinished;
    private String bookedBy;

}
