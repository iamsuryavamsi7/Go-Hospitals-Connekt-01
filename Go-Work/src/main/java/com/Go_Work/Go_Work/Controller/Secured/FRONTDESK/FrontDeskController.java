package com.Go_Work.Go_Work.Controller.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Department;
import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.DepartmentNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Service.Secured.FRONTDESK.FrontDeskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/front-desk")
@RequiredArgsConstructor
public class FrontDeskController {

    private final FrontDeskService frontDeskService;

    @PostMapping("/bookApplication")
    public ResponseEntity<String> bookAppointment(
        @RequestBody Applications applications
    ){

        String message = frontDeskService.bookAppointment(applications);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/getAllBookingsByNotComplete")
    public ResponseEntity<List<ApplicationsResponseModel>> getAllBookingsByNotComplete(){

        List<ApplicationsResponseModel> message = frontDeskService.getAllBookingsByNotComplete();

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchApplicationById/{applicationId}")
    public ResponseEntity<ApplicationsResponseModel> fetchAppointmentById(
            @PathVariable("applicationId") Long id
    ) throws AppointmentNotFoundException {

        ApplicationsResponseModel fetchedApplication = frontDeskService.fetchApplicationById(id);

        return ResponseEntity.ok(fetchedApplication);

    }

    @GetMapping("/getDepartments")
    public ResponseEntity<List<Department>> getDepartments(){

        List<Department> fetchedDepartments = frontDeskService.getDepartments();

        return ResponseEntity.ok(fetchedDepartments);

    }

    @GetMapping("/getDepartmentById/{departmentId}")
    public ResponseEntity<Department> getDepartmentById(
            @PathVariable("departmentId") Long departmentId
    ) throws DepartmentNotFoundException {

        Department fetchedDepartments = frontDeskService.getDepartmentById(departmentId);

        return ResponseEntity.ok(fetchedDepartments);

    }

    @GetMapping("/fetchDoctorsByDepartmentId/{departmentId}")
    public ResponseEntity<List<Doctor>> fetchDoctorsByDepartmentId(
            @PathVariable("departmentId") Long departmentId
    ) throws DepartmentNotFoundException {

        List<Doctor> fetchedDoctors = frontDeskService.fetchDoctorsByDepartmentId(departmentId);

        return ResponseEntity.ok(fetchedDoctors);

    }

}
