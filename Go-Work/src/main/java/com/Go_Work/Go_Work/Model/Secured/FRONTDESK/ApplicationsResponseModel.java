package com.Go_Work.Go_Work.Model.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationsResponseModel {

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
    private ConsultationType consultationType;
    private String treatmentDoneMessage;
    private boolean treatmentDone;
    private boolean paymentDone;
    private Date paymentDoneTime;
    private Date applicationCompletedTime;

    private boolean isPatientGotApproved;

    private boolean isForCrossConsultation;

    private Date medicalSupportUserAssignedTime;


    private String patientAdmitMessage;

    private Long medicalSupportUserId;
    private String medicalSupportUserName;

}
