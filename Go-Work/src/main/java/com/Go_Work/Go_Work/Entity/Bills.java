package com.Go_Work.Go_Work.Entity;

import com.Go_Work.Go_Work.Entity.Enum.BillType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "bills_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bills {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String BillNo;
    private Date timeStamp;
    private BillType billType;

    // Many Bills - One Application
    @ManyToOne
    @JoinColumn(
            name = "application_id"
    )
    @JsonBackReference
    private Applications applications;

}
