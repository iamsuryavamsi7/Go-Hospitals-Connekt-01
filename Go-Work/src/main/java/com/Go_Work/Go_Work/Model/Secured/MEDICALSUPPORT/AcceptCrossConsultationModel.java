package com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcceptCrossConsultationModel {

    private Long applicationId;
    private String reasonForVisit;
    private String doctorName;
    private String billNo;

}
