package com.Go_Work.Go_Work.Controller.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.Appointments;
import com.Go_Work.Go_Work.Entity.Department;
import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.DepartmentNotFoundException;
import com.Go_Work.Go_Work.Service.Secured.FRONTDESK.FrontDeskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class FrontDeskController {

    private final FrontDeskService frontDeskService;

    @PostMapping("/bookAppointment")
    public ResponseEntity<String> bookAppointment(
        @RequestBody Appointments appointments
    ){

        String message = frontDeskService.bookAppointment(appointments);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/getAllBookingsByNotComplete")
    public ResponseEntity<List<Appointments>> getAllBookingsByNotComplete(){

        List<Appointments> message = frontDeskService.getAllBookingsByNotComplete();

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchAppointmentById/{appointmentId}")
    public ResponseEntity<Appointments> fetchAppointmentById(
            @PathVariable("appointmentId") Long id
    ) throws AppointmentNotFoundException {

        Appointments fetchedAppointment = frontDeskService.fetchAppointmentById(id);

        return ResponseEntity.ok(fetchedAppointment);

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
