package com.Go_Work.Go_Work.Entity;

import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(
        name = "applications_table",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "patientId"
                }
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Applications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String tempororyBillNo;
    private int age;
    private String contact;
    private String location;
    private String gender;
    private String reasonForVisit;
    private String preferredDoctorName;
    private Date appointmentCreatedOn;
    private String bookedBy;

    private String patientId;

    @Enumerated(EnumType.STRING)
    private ConsultationType consultationType;
    private String treatmentDoneMessage;
    private String pharmacyMessage;

    @OneToMany(
            mappedBy = "application",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference
    private List<ImageUrls> prescriptionUrl = new ArrayList<>();

    private boolean isPatientGotApproved;

    private Date nextFollowUpDate;
    private Boolean isMedicationPlusFollow;

    private boolean treatmentDone;
    private boolean paymentDone;
    private Date paymentDoneTime;
    private Date applicationCompletedTime;

    private String patientAdmitMessage;

    private Date medicalSupportUserAssignedTime;

    private Date consultationAssignedTime;

    @ManyToOne
    @JsonBackReference("medical-application")
    @JoinColumn(
            name = "medical_support_user_id"
    )
    private User medicalSupportUser;

    @ManyToOne
    @JsonBackReference("tele-support-application")
    @JoinColumn(
            name = "tele_support_user_id"
    )
    private User teleSupportUser;

    private Date teleSupportUserAssignedTime;

    private boolean teleSupportConsellingDone;

    private Date pharmacyGoingTime;

    @OneToMany(
            mappedBy = "application",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference("surgeryDocuments")
    private List<SurgeryDocumentsUrls> surgeryDocumentsUrls = new ArrayList<>();

    // One Applications - Many Bills
    @OneToMany(
            mappedBy = "applications",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    @JsonManagedReference
    private List<Bills> bills = new ArrayList<>();

}
