package com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookAppointmentWebSocketModel {

    private Long deleteAppointmentID;
    private String name;
    private int age;
    private String contact;
    private String location;
    private String gender;
    private String reasonForVisit;
    private String preferredDoctorName;
    private String billNo;
    private Date appointmentCreatedOn;
    private String bookedBy;

}
