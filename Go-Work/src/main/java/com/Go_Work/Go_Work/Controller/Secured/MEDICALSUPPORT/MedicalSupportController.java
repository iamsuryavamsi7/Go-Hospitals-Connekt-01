package com.Go_Work.Go_Work.Controller.Secured.MEDICALSUPPORT;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.MedicalSupportUserNotFound;
import com.Go_Work.Go_Work.Error.NotificationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Service.Secured.MEDICALSUPPORT.MedicalSupportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/medical-support")
@RequiredArgsConstructor
public class MedicalSupportController {

    private final MedicalSupportService medicalSupportService;

    @GetMapping("/getAllBookingsByNotCompletePaging/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> getAllBookingsByNotComplete(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize
    ){

        List<ApplicationsResponseModel> message = medicalSupportService.getAllBookingsByNotCompletePaging(page, pageSize);

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

    @GetMapping("/fetchNotificationByUserId/{userId}")
    public ResponseEntity<List<Notification>> fetchNotificationByUserId(
            @PathVariable("userId") Long userId
    ){

        List<Notification> fetchedNotifications = medicalSupportService.fetchNotificationByUserId(userId);

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
    ) throws ApplicationNotFoundException {

        String message = medicalSupportService.makeConsultationType(applicationId, consultationType);

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

    @GetMapping("/fetchMedicalPlusFollowUpData/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchMedicalPlusFollowUpData(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchMedicalPlusFollowUpData(userObjectId);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchSurgeryCareData/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchSurgeryCareData(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchSurgeryCareData(userObjectId);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchPharmacyData/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchPharmacyData(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchPharmacyData(userObjectId);

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

    @GetMapping("/fetchAllCrossConsultation/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllCrossConsultation(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchAllCrossConsultation(userObjectId);

        return ResponseEntity.ok(fetchedData);

    }

    @GetMapping("/fetchAllPatientAdmit/{userObjectId}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllPatientAdmit(
            @PathVariable("userObjectId") Long userObjectId
    ){

        List<ApplicationsResponseModel> fetchedData = medicalSupportService.fetchAllPatientAdmit(userObjectId);

        return ResponseEntity.ok(fetchedData);

    }

    @PostMapping("/uploadPrescription/{applicationId}")
    public ResponseEntity<String> uploadPrescription(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam("imageFile") List<MultipartFile> imageFile,
            @RequestParam("prescriptionMessage") String prescriptionMessage
    ) throws ApplicationNotFoundException, IOException {

        String successMessage = medicalSupportService.uploadPrescription(applicationId, imageFile, prescriptionMessage);

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
    public ResponseEntity<List<Applications>> fetchMedicalSupportJobsByIdPaging(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<Applications> fetchedApplications = medicalSupportService.fetchMedicalSupportJobsByIdPaging2(jwtToken, page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

}
