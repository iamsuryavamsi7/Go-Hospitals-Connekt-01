package com.Go_Work.Go_Work.Model.Secured.ADMIN;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentPutModel {

    @NotNull
    @NotBlank
    private String departmentName;

}
