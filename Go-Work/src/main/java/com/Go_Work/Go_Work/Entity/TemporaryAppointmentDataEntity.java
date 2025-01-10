package com.Go_Work.Go_Work.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "temporary_appointment_data_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryAppointmentDataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String newPatientOnBoardName;
    private Long newPatientOnBoardAge;
    private String newPatientOnBoardContact;
    private String newPatientOnBoardAadharNumber;
    private String newPatientOnBoardLocation;
    private Date timeStamp;

}
