package com.Go_Work.Go_Work.Entity;

import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "consultation_types_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationTypesData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ConsultationType consultationType;

    private Date timeStamp;

    @ManyToOne
    @JoinColumn(
            name = "application_id"
    )
    @JsonBackReference("consultationTypesData")
    private Applications applications;

}
