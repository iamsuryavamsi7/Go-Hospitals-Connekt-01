package com.Go_Work.Go_Work.Model.Secured.TELESUPPORT;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.SurgeryPaymentType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeleSupportResponseModel {

    private Long id;
    private String name;
    private int age;
    private String contact;
    private String location;
    private String gender;
    private String reasonForVisit;
    private String preferredDoctorName;
    private Date appointmentCreatedOn;
    private String bookedBy;
    private String patientId;
    private String tempororyBillNo;
    private String patientDropOutMessage;

    @Enumerated(EnumType.STRING)
    private ConsultationType consultationType = ConsultationType.NOTASSIGNED;

    private String treatmentDoneMessage;


    private List<ImageUrls> prescriptionUrl = new ArrayList<>();

    private boolean isPatientGotApproved = false;

    private String caseCloseInput;

    private Boolean isMedicationPlusFollow = false;

    private boolean treatmentDone = false;
    private Boolean paymentDone = false;

    private Boolean counsellingIsInProgress = false;

    private Date paymentDoneTime;
    private Date applicationCompletedTime;

    private String patientAdmitMessage;

    private Date medicalSupportUserAssignedTime;

    private Date consultationAssignedTime;

    private User medicalSupportUser;

    private User teleSupportUser;

    private Date teleSupportUserAssignedTime;

    private boolean teleSupportConsellingDone = false;

    private boolean teleSupportSurgeryDocumentsAccept = false;

    private Date surgeryDate;
    private Date surgeryStartTime;
    private Date surgeryEndTime;
    private Boolean SurgeryCompleted = false;

    private String roomNo;

    private Date pharmacyGoingTime;

    private List<PharmacyMessage> pharmacyMessages = new ArrayList<>();

    private Boolean needMedicines = false;

    @JsonManagedReference("surgeryDocuments")
    private List<SurgeryDocumentsUrls> surgeryDocumentsUrls = new ArrayList<>();

    private List<Bills> bills = new ArrayList<>();

    private List<NextAppointmentDate> nextAppointmentDate = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private SurgeryPaymentType surgeryPaymentType = SurgeryPaymentType.CASH;

    private String surgeryCounsellorMessage;

    private Long medicalSupportUserId;
    private String medicalSupportUserName;

    private Long teleSupportUserId;
    private String teleSupportUserName;

    private Date nextFollowUpDate;

    private String billNo;

    private String surgeryImgDocFileURL;

}
