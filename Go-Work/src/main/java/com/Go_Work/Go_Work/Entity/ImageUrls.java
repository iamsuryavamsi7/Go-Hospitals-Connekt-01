package com.Go_Work.Go_Work.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String prescriptionURL;

    @ManyToOne
    @JoinColumn(
            name = "application_id"
    )
    @JsonBackReference
    private Applications application;

}
