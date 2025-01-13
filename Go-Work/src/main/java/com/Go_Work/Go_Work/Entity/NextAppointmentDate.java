package com.Go_Work.Go_Work.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NextAppointmentDate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date nextFollowUpDate;
    private String note;

    // Many appointment dates - one appointment
    @ManyToOne
    @JoinColumn(
            name = "application_id"
    )
    @JsonBackReference("nextAppointmentDate")
    private Applications application;

}
