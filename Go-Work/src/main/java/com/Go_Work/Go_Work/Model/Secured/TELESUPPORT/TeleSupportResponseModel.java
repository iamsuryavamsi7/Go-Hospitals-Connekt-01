package com.Go_Work.Go_Work.Model.Secured.TELESUPPORT;

import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.ImageUrls;
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
    private String pharmacyMessage;

    private boolean isPatientGotApproved;

    private boolean isForCrossConsultation;

    private String patientAdmitMessage;

    private Date medicalSupportUserAssignedTime;

    private Date consultationAssignedTime;

    private List<ImageUrls> prescriptionsUrls;

    private Long medicalSupportUserId;
    private String medicalSupportUserName;

    private Long teleSupportUserId;
    private String teleSupportUserName;

    private Date teleSupportUserAssignedTime;

    private boolean teleSupportConsellingDone;

    private List<SurgeryDocumentsUrls> surgeryDocumentsUrls = new ArrayList<>();

}
