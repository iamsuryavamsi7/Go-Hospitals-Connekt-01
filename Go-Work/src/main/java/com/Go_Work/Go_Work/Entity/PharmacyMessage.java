package com.Go_Work.Go_Work.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "pharmacy_message_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String pharmacyMessage;
    private Date timeStamp;

    @ManyToOne
    @JoinColumn(
            name = "application_id"
    )
    @JsonBackReference("pharmacyMessage")
    private Applications application;

}
