package com.Go_Work.Go_Work.Model.Secured.FRONTDESK;

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
    private boolean appointmentFinished;
    private String bookedBy;

    private Long medicalSupportUserId;
    private String medicalSupportUserName;

}
