package com.Go_Work.Go_Work.Model.Secured.TELESUPPORT;

import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.ImageUrls;
import com.Go_Work.Go_Work.Entity.NextAppointmentDate;
import com.Go_Work.Go_Work.Entity.SurgeryDocumentsUrls;
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
    private String patientId;
    private String name;
    private int age;
    private String contact;
    private String gender;
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
    private Date nextFollowUpDate;
    private String pharmacyMessage;

    private boolean isPatientGotApproved;

    private boolean isForCrossConsultation;

    private Date medicalSupportUserAssignedTime;

    private Date consultationAssignedTime;

    private String patientAdmitMessage;

    private Long medicalSupportUserId;
    private String medicalSupportUserName;

    private List<NextAppointmentDate> nextAppointmentDate = new ArrayList<>();

    private Long teleSupportUserId;
    private String teleSupportUserName;

}
