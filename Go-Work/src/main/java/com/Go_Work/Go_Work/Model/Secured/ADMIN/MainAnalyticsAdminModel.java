package com.Go_Work.Go_Work.Model.Secured.ADMIN;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainAnalyticsAdminModel {

    private long opsCount;
    private long onSiteCount;
    private long patientAdmitsCount;
    private long followUpPatientsCount;
    private long crossConsultationCount;
    private long surgeriesCompletedCount;
    private long closedCasesCount;
    private long patientDropOutCount;

}
