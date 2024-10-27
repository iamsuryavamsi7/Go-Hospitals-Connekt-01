package com.Go_Work.Go_Work.Entity;

import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    private String bookedBy;

    @Enumerated(EnumType.STRING)
    private ConsultationType consultationType;
    private String treatmentDoneMessage;

    @OneToMany(
            mappedBy = "application",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference
    private List<ImageUrls> prescriptionUrl = new ArrayList<>();

    private boolean treatmentDone;
    private boolean paymentDone;
    private Date paymentDoneTime;
    private Date applicationCompletedTime;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(
            name = "medical_support_user_id"
    )
    private User medicalSupportUser;

}