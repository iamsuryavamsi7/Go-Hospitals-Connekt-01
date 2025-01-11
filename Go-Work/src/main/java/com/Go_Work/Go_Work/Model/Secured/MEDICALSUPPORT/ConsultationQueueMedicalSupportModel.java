package com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationQueueMedicalSupportModel {

    private Long id;
    private String name;
    private String preferredDoctorName;
    private String billNo;
    private String medicalSupportUserName;

}
