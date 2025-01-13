package com.Go_Work.Go_Work.Controller.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Error.*;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.MedicalSupportResponseModel;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Service.Secured.FRONTDESK.FrontDeskService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
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

    @GetMapping("/fetchUserObject")
    public ResponseEntity<UserObject> fetchUserObject(
            HttpServletRequest request
    ){

        UserObject fetchedUserObject = frontDeskService.fetchUserObject(request);

        return ResponseEntity.ok(fetchedUserObject);

    }

    @GetMapping("/fetchNotificationByUserId")
    public ResponseEntity<List<Notification>> fetchNotificationByUserId(
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<Notification> fetchedNotifications = frontDeskService.fetchNotificationByUserId(jwtToken);

        return ResponseEntity.ok(fetchedNotifications);

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

    @GetMapping("/getAllCrossConsultationDetails/{pageNumber}/{defaultSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> getAllCrossConsultationDetails(
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("defaultSize") int size
    ){

        List<ApplicationsResponseModel> message = frontDeskService.getAllCrossConsultationDetails(pageNumber, size);

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

    @GetMapping("/setNotificationReadByNotificationId/{notificationId}")
    public ResponseEntity<String> setNotificationReadByNotificationId(
            @PathVariable("notificationId") Long id
    ) throws NotificationNotFoundException {

        String message = frontDeskService.setNotificationReadByNotificationId(id);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/notificationSoundPlayed/{notificationID}")
    public ResponseEntity<Boolean> notificationSoundPlayed(
            @PathVariable("notificationID") Long notificationID
    ) throws NotificationNotFoundException {

        Boolean notificationPlayed = frontDeskService.notificationSoundPlayed(notificationID);

        return ResponseEntity.ok(notificationPlayed);

    }

    @GetMapping("/checkTemporaryDataAvailableForNewPatientOnBoardPage")
    public ResponseEntity<Boolean> checkTemporaryDataAvailableForNewPatientOnBoardPage(){

        Boolean fetchBooleanValue = frontDeskService.checkTemporaryDataAvailableForNewPatientOnBoardPage();

        return ResponseEntity.ok(fetchBooleanValue);

    }

    @GetMapping("/deleteTemporaryAppointmentById/{appointmentID}")
    public ResponseEntity<Boolean> deleteTemporaryAppointmentById(
            @PathVariable("appointmentID") Long appointmentID
    ){

        Boolean fetchedBooleanValue = frontDeskService.deleteTemporaryAppointmentById(appointmentID);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @GetMapping("/checkCrossConsultationAvailableOrNot")
    public ResponseEntity<Boolean> checkCrossConsultationAvailableOrNot(){

        Boolean fetchedBooleanValue = frontDeskService.checkCrossConsultationAvailableOrNot();

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @GetMapping("/checkFollowUpPatientAvailableOrNot")
    public ResponseEntity<Boolean> checkFollowUpPatientAvailableOrNot(){

        Boolean fetchedBooleanValue = frontDeskService.checkFollowUpPatientAvailableOrNot();

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @PostMapping("/rescheduleAppointment/{applicationID}")
    public ResponseEntity<Boolean> rescheduleAppointment(
            @PathVariable("applicationID") Long applicationID,
            @RequestParam("note") String note,
            @RequestParam("updateNextAppointmentDateValue")Date updateNextAppointmentDateValue
            ) throws ApplicationNotFoundException {

        Boolean fetchedBooleanValue = frontDeskService.rescheduleAppointment(applicationID, note, updateNextAppointmentDateValue);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @GetMapping("/deleteNextAppointmentData/{nextAppointmentID}")
    public ResponseEntity<Boolean> deleteNextAppointmentData(
            @PathVariable("nextAppointmentID") Long nextAppointmentID
    ){

        Boolean fetchedBooleanValue = frontDeskService.deleteNextAppointmentData(nextAppointmentID);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @GetMapping("/forwardToNurse/{applicationID}")
    public ResponseEntity<Boolean> forwardToNurse(
            @PathVariable("applicationID") Long applicationID
    ) throws ApplicationNotFoundException {

        Boolean fetchedBooleanValue = frontDeskService.forwardToNurse(applicationID);

        return ResponseEntity.ok(fetchedBooleanValue);

    }


    @GetMapping("/fetchCaseClosedAppointmentsPaging/{pageNumber}/{defaultSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchCaseClosedAppointmentsPaging(
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("defaultSize") int size
    ){

        List<ApplicationsResponseModel> fetchedApplications = frontDeskService.fetchCaseClosedAppointmentsPaging(pageNumber, size);

        return ResponseEntity.ok(fetchedApplications);

    }

}
