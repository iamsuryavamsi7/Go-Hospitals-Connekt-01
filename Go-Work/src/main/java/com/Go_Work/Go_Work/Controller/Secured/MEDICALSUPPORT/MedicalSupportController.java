package com.Go_Work.Go_Work.Controller.Secured.MEDICALSUPPORT;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Error.*;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.ConsultationQueueMedicalSupportModel;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Service.Secured.MEDICALSUPPORT.MedicalSupportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/medical-support")
@RequiredArgsConstructor
public class MedicalSupportController {

    private final MedicalSupportService medicalSupportService;

    @GetMapping("/fetchUserRole")
    public ResponseEntity<String> fetchUserRole(
            HttpServletRequest request
    ) throws MedicalSupportUserNotFound {

        String userRole = medicalSupportService.fetchUserRole(request);

        return ResponseEntity.ok(userRole);

    }

    @PostMapping("/fetchUserObject")
    public ResponseEntity<UserObject> fetchUserObject(
            @RequestParam("jwtToken") String jwtToken
    ){

        UserObject fetchedUserObject = medicalSupportService.fetchUserObject(jwtToken);

        return ResponseEntity.ok(fetchedUserObject);

    }

    @GetMapping("/notificationSoundPlayed/{notificationID}")
    public ResponseEntity<Boolean> notificationSoundPlayed(
            @PathVariable("notificationID") Long notificationID
    ) throws NotificationNotFoundException {

        Boolean notificationPlayed = medicalSupportService.notificationSoundPlayed(notificationID);

        return ResponseEntity.ok(notificationPlayed);

    }










    @GetMapping("/getAllBookingsByNotCompletePaging/{page}/{pageSize}")
    public ResponseEntity<List<ConsultationQueueMedicalSupportModel>> getAllBookingsByNotComplete(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize
    ){

        List<ConsultationQueueMedicalSupportModel> message = medicalSupportService.getAllBookingsByNotCompletePaging(page, pageSize);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchApplicationById/{applicationId}")
    public ResponseEntity<ApplicationsResponseModel> fetchAppointmentById(
            @PathVariable("applicationId") Long id
    ) throws AppointmentNotFoundException {

        ApplicationsResponseModel fetchedApplication= medicalSupportService.fetchApplicationById(id);

        return ResponseEntity.ok(fetchedApplication);

    }

    @GetMapping("/assignApplication/{applicationId}/ToMedicalSupportUser/{medicalSupportUserId}")
    public ResponseEntity<String> assignApplicationToMedicalSupportUser(
            @PathVariable("applicationId") Long applicationId,
            @PathVariable("medicalSupportUserId") Long medicalSupportUserId
    ) throws ApplicationNotFoundException, MedicalSupportUserNotFound {

        String message = medicalSupportService.assignApplicationToMedicalSupportUser(applicationId, medicalSupportUserId);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchMedicalSupportJobsById/{medicalSupportId}")
    public ResponseEntity<List<Applications>> fetchMedicalSupportJobsById(
            @PathVariable("medicalSupportId") Long medicalSupportId
    ) throws MedicalSupportUserNotFound {

        List<Applications> fetchedJobs = medicalSupportService.fetchMedicalSupportJobsById(medicalSupportId);

        return ResponseEntity.ok(fetchedJobs);

    }

    @GetMapping("/fetchNotificationByUserId")
    public ResponseEntity<List<Notification>> fetchNotificationByUserId(
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<Notification> fetchedNotifications = medicalSupportService.fetchNotificationByUserId(jwtToken);

        return ResponseEntity.ok(fetchedNotifications);

    }

    @GetMapping("/setNotificationReadByNotificationId/{notificationId}")
    public ResponseEntity<String> setNotificationReadByNotificationId(
            @PathVariable("notificationId") Long id
    ) throws NotificationNotFoundException {

        String message = medicalSupportService.setNotificationReadByNotificationId(id);

        return ResponseEntity.ok(message);

    }

    @PostMapping("/makeConsultationType/{applicationId}")
    public ResponseEntity<String> makeConsultationType(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam("consultationType") ConsultationType consultationType
    ) throws ApplicationNotFoundException, ConsultationTypeNotFoundException {

        String message = medicalSupportService.makeConsultationType2(applicationId, consultationType);

        return ResponseEntity.ok(message);

    }

    @PostMapping("/makeConsultationTypeCaseClose/{applicationId}")
    public ResponseEntity<Boolean> makeConsultationTypeCaseClose(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam(value = "caseCloseInput", required = false) String caseCloseInput
    ) throws ApplicationNotFoundException, ConsultationTypeNotFoundException {

        Boolean message = medicalSupportService.makeConsultationTypeCaseClose(applicationId, caseCloseInput);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchAllOnsiteTreatmentDataPaging/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllOnsiteTreatmentDataPaging(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchAllOnsiteTreatmentData(jwtToken, page, pageSize);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchMedicalPlusFollowUpDataPaging/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchMedicalPlusFollowUpData(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchMedicalPlusFollowUpData(jwtToken, page, pageSize);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchSurgeryCareDataPaging/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchSurgeryCareData(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchSurgeryCareData(jwtToken, page, pageSize);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchPharmacyDataPaging/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchPharmacyData(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchPharmacyData(jwtToken, page, pageSize);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchPatientAdmitData/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchPatientAdmitData(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchPatientAdmitData(userObjectId);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchAllMedicationPlusFollowUp/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllMedicationPlusFollowUp(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchAllMedicationPlusFollowUp(userObjectId);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchAllSurgeryCare/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllSurgeryCare(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchAllSurgeryCare(userObjectId);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchAllPharmacy/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllPharmacy(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchAllPharmacy(userObjectId);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchAllCrossConsultationPaging/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllCrossConsultation(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchAllCrossConsultation(jwtToken, page, pageSize);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchAllPatientAdmitPaging/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllPatientAdmit(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchAllPatientAdmit(jwtToken, page, pageSize);

        return ResponseEntity.ok(fetchedData);

    }

    @PostMapping("/medicationPlusFollowUpTreatmentDone/{applicationId}")
    public ResponseEntity<String> medicationPlusFollowUpTreatmentDone(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam(value = "prescriptionMessage", required = false) String prescriptionMessage,
            @RequestParam("nextMedicationDate") Date nextMedicationDate
    ) throws ApplicationNotFoundException, IOException {

        String successMessage = medicalSupportService.medicationPlusFollowUpTreatmentDone(applicationId, prescriptionMessage, nextMedicationDate);

        return ResponseEntity.ok(successMessage);

    }

    @GetMapping("/sendRequestToFrontDeskCrossConsultation/{applicationId}")
    public ResponseEntity<String> sendRequestToFrontDeskCrossConsultation(
            @PathVariable("applicationId") Long applicationId
    ) throws ApplicationNotFoundException {

        String message = medicalSupportService.sendRequestToFrontDeskCrossConsultation(applicationId);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchMedicalSupportJobsByIdPaging/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchMedicalSupportJobsByIdPaging(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<ApplicationsResponseModel> fetchedApplications = medicalSupportService.fetchMedicalSupportJobsByIdPaging2(jwtToken, page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

    @GetMapping("/changeStatusToDMOCHECKCOMPLETED/{applicationID}")
    public ResponseEntity<Boolean> changeStatusToDMOCHECKCOMPLETED(
            @PathVariable("applicationID") Long applicationID
    ) throws ApplicationNotFoundException {

        Boolean status = medicalSupportService.changeStatusToDMOCHECKCOMPLETED(applicationID);

        return ResponseEntity.ok(status);

    }

    @GetMapping("/checkWaitingPatientsAreAvailableOrNot")
    public ResponseEntity<Boolean> checkWaitingPatientsAreAvailableOrNot(){

        Boolean status = medicalSupportService.checkWaitingPatientsAreAvailableOrNot();

        return ResponseEntity.ok(status);

    }

    @PostMapping("/sendPrescriptionToPharmacy")
    public ResponseEntity<Boolean> sendPrescriptionToPharmacy(
            @RequestParam("applicationId") Long applicationId,
            @RequestParam("imageFile") List<MultipartFile> imageFiles,
            @RequestParam(value = "pharmacyMessage", required = false) String prescriptionMessage
    ) throws ApplicationNotFoundException {

        Boolean status = medicalSupportService.sendPrescriptionToPharmacy(applicationId, imageFiles, prescriptionMessage);

        return ResponseEntity.ok(status);

    }

}
