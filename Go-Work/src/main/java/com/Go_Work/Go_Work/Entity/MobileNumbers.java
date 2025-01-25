package com.Go_Work.Go_Work.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "mobile_numbers_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MobileNumbers {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String mobileNumber;
    private Date createdTimeStamp;

}
