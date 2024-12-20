package com.Go_Work.Go_Work.Model.Secured.FRONTDESK;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FetchPatientDataResponseModel {

    private String newPatientOnBoardName;
    private Long newPatientOnBoardAge;
    private String newPatientOnBoardContact;
    private String newPatientOnBoardAadharNumber;

}
