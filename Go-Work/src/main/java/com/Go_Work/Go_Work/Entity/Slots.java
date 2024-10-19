package com.Go_Work.Go_Work.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
        name = "slots_table",
        uniqueConstraints = @UniqueConstraint(columnNames = {
                "time"
        })
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Slots {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private LocalDate date;
    private String time;
    private boolean isBooked;

}
