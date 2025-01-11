package com.Go_Work.Go_Work.Controller.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Department;
import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Entity.TemporaryAppointmentDataEntity;
import com.Go_Work.Go_Work.Error.*;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.MedicalSupportResponseModel;
import com.Go_Work.Go_Work.Service.Secured.FRONTDESK.FrontDeskService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/front-desk")
@RequiredArgsConstructor
public class FrontDeskController {

    private final FrontDeskService frontDeskService;

    // API to fetch user role
    @GetMapping("/fetchUserRole")
    public ResponseEntity<String> fetchUserRole(
            HttpServletRequest request
    ) throws FrontDeskUserNotFoundException {

        String fetchedRole = frontDeskService.fetchUserRole(request);

        return ResponseEntity.ok(fetchedRole);

    }

    @GetMapping("/fetchPatientOnBoardData")
    public ResponseEntity<List<TemporaryAppointmentDataEntity>> fetchPatientOnBoardData(
            HttpServletRequest request
    ) throws FrontDeskUserNotFoundException, RoleMismatchException {

        List<TemporaryAppointmentDataEntity> fetchedData = frontDeskService.fetchPatientOnBoardData(request);

        return ResponseEntity.ok(fetchedData);

    }


    @GetMapping("/checkTheAppointmentIsAvailable/{applicationID}")
    public ResponseEntity<Boolean> checkTheAppointmentIsAvailable(
            @PathVariable("applicationID") Long applicationID
    ) throws TemporaryAppointmentNotFounException {

        Boolean status = frontDeskService.checkTheAppointmentIsAvailable(applicationID);

        return ResponseEntity.ok(status);

    }















    @PostMapping("/bookApplication/{temporaryAppointmentID}")
    public ResponseEntity<String> bookAppointment(
        @RequestBody Applications applications,
        @PathVariable("temporaryAppointmentID") Long temporaryAppointmentID
    ){

        String message = frontDeskService.bookAppointment(applications, temporaryAppointmentID);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/getAllBookingsByNotComplete")
    public ResponseEntity<List<ApplicationsResponseModel>> getAllBookingsByNotComplete(){

        List<ApplicationsResponseModel> message = frontDeskService.getAllBookingsByNotComplete();

        return ResponseEntity.ok(message);

    }

    @GetMapping("/getAllBookingsByWaitingPaging/{pageNumber}/{defaultSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> getAllBookingsByNotComplete(
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("defaultSize") int size
    ){

        List<ApplicationsResponseModel> message = frontDeskService.getAllBookingsByNotCompletePaging(pageNumber, size);

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

    @GetMapping("/fetchPatientApprovals/{pageNumber}/{size}")
    public ResponseEntity<List<MedicalSupportResponseModel>> fetchPatientApprovals(
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("size") int size
    ){

        List<MedicalSupportResponseModel> response = frontDeskService.fetchPatientApprovals( pageNumber, size );

        return ResponseEntity.ok(response);

    }

    @DeleteMapping("/deleteApplicationById/{applicationId}")
    public ResponseEntity<String> deleteApplicationById(
            @PathVariable("applicationId") Long applicationId
    ){

        String message = frontDeskService.deleteApplicationById(applicationId);

        return ResponseEntity.ok(message);

    }

    @PostMapping("/acceptApplicationById/{applicationId}")
    public ResponseEntity<String> acceptApplicationById(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam("patientAdmitMessage") String patientAdmitMessage
    ) throws ApplicationNotFoundException {

        String message = frontDeskService.acceptApplicationById(applicationId, patientAdmitMessage);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchMedicationPlusFollowUpPaging/{pageNumber}/{defaultSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchMedicationPlusFollowUpPaging(
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("defaultSize") int size
    ){

        List<ApplicationsResponseModel> fetchedApplications = frontDeskService.fetchMedicationPlusFollowUpPaging(pageNumber, size);

        return ResponseEntity.ok(fetchedApplications);

    }

    @PostMapping("/acceptCrossConsultation/{applicationId}")
    public ResponseEntity<String> acceptCrossConsultation(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam("reasonForVisit") String reasonForVisit,
            @RequestParam("doctorName") String doctorName
    ) throws ApplicationNotFoundException {

        String message = frontDeskService.acceptCrossConsultation(applicationId, reasonForVisit, doctorName);

        return ResponseEntity.ok(message);

    }

}
