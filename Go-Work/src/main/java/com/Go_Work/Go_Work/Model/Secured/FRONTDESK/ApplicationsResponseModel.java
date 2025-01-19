package com.Go_Work.Go_Work.Model.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.Bills;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.SurgeryPaymentType;
import com.Go_Work.Go_Work.Entity.ImageUrls;
import com.Go_Work.Go_Work.Entity.NextAppointmentDate;
import com.Go_Work.Go_Work.Entity.PharmacyMessage;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationsResponseModel {

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
    private String patientDropOutMessage;

    private String caseCloseInput;

    private Boolean needMedicines;

    private boolean isPatientGotApproved;

    private boolean isForCrossConsultation;

    private Date medicalSupportUserAssignedTime;

    private Date consultationAssignedTime;

    private String patientAdmitMessage;

    private Long medicalSupportUserId;
    private String medicalSupportUserName;

    private List<NextAppointmentDate> nextAppointmentDate = new ArrayList<>();

    private List<PharmacyMessage> pharmacyMessages = new ArrayList<>();

    private List<Bills> bills = new ArrayList<>();

    private List<ImageUrls> prescriptionUrl = new ArrayList<>();

    private SurgeryPaymentType surgeryPaymentType;

    private Boolean counsellingIsInProgress = false;

}
