package com.Go_Work.Go_Work.Model.Secured.ADMIN;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetDoctorModel {

    private Long id;
    private String doctorName;
    private String doctorDepartment;

}
