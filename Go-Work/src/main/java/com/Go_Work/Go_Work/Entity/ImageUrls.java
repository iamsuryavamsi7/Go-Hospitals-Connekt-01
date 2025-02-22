package com.Go_Work.Go_Work.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(
        name = "image_urls_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageUrls {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String prescriptionMessage;
    private List<String> prescriptionURL = new ArrayList<>();
    private Date timeStamp;

    @ManyToOne
    @JoinColumn(
            name = "application_id"
    )
    @JsonBackReference("prescriptionURL")
    private Applications application;

}
