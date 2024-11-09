package com.Go_Work.Go_Work.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "surgery_documents_urls_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurgeryDocumentsUrls {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String surgeryDocumentsUrl;

    @ManyToOne
    @JoinColumn(
            name = "application_id"
    )
    @JsonBackReference("surgeryDocuments")
    private Applications application;

}
