package com.Go_Work.Go_Work.Controller.Secured.PHARMACY;

import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.FrontDeskUserNotFoundException;
import com.Go_Work.Go_Work.Error.NotificationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.MedicalSupportResponseModel;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Service.Secured.PHARMACY.PharmacyService;
import com.Go_Work.Go_Work.Service.Secured.S3.S3Service;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    private final ApplicationsRepo applicationsRepo;

    private final S3Service s3Service;

    @GetMapping("/fetchApplicationById/{applicationId}")
    public ResponseEntity<MedicalSupportResponseModel> fetchAppointmentById(
            @PathVariable("applicationId") Long id
    ) throws AppointmentNotFoundException {

        MedicalSupportResponseModel fetchedApplication= pharmacyService.fetchApplicationById(id);

        return ResponseEntity.ok(fetchedApplication);

    }

    @PostMapping("/consultationCompleted/{applicationId}")
    public ResponseEntity<String> consultationCompleted(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam("pharmacyMessage") String pharmacyMessage
    ) throws ApplicationNotFoundException {

        String successMessage = pharmacyService.consultationCompleted(applicationId, pharmacyMessage);

        return ResponseEntity.ok(successMessage);

    }

    @GetMapping("/fetchAllPharmacyMedications")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllPharmacyMedications(){

        List<ApplicationsResponseModel> fetchedApplications = pharmacyService.fetchAllPharmacyMedications();

        return ResponseEntity.ok(fetchedApplications);

    }

    @GetMapping("/fetchAllPharmacyCompletedMedications")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllPharmacyCompletedMedications(){

        List<ApplicationsResponseModel> fetchedApplications = pharmacyService.fetchAllPharmacyCompletedMedications();

        return ResponseEntity.ok(fetchedApplications);

    }

//    @GetMapping("/fetchAllPharmacyCompletedMedicationsPaging/{pageNumber}/{defaultSize}")
//    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllPharmacyCompletedMedicationsPaging(
//            @PathVariable("pageNumber") int pageNumber,
//            @PathVariable("defaultSize") int size
//    ){
//
//        List<ApplicationsResponseModel> fetchedApplications = pharmacyService.fetchAllPharmacyCompletedMedicationsPaging(pageNumber, size);
//
//        return ResponseEntity.ok(fetchedApplications);
//
//    }

    @GetMapping("/fetchAllPharmacyMedicationsPaging/{pageNumber}/{defaultSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllPharmacyMedicationsPaging(
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("defaultSize") int size
    ){

        List<ApplicationsResponseModel> fetchedApplications = pharmacyService.fetchAllPharmacyMedicationsPaging(pageNumber, size
        );

        return ResponseEntity.ok(fetchedApplications);

    }

    // API to fetch user role
    @GetMapping("/fetchUserRole")
    public ResponseEntity<String> fetchUserRole(
            HttpServletRequest request
    ) throws FrontDeskUserNotFoundException {

        String fetchedRole = pharmacyService.fetchUserRole(request);

        return ResponseEntity.ok(fetchedRole);

    }

    @GetMapping("/checkPendingMedicationsRefresh")
    public ResponseEntity<Boolean> checkPendingMedicationsRefresh(){

        Boolean booleanValue = pharmacyService.checkPendingMedicationsRefresh();

        return ResponseEntity.ok(booleanValue);

    }

    @GetMapping("/setNotificationReadByNotificationId/{notificationId}")
    public ResponseEntity<String> setNotificationReadByNotificationId(
            @PathVariable("notificationId") Long id
    ) throws NotificationNotFoundException {

        String message = pharmacyService.setNotificationReadByNotificationId(id);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchNotificationByUserId")
    public ResponseEntity<List<Notification>> fetchNotificationByUserId(
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<Notification> fetchedNotifications = pharmacyService.fetchNotificationByUserId(jwtToken);

        return ResponseEntity.ok(fetchedNotifications);

    }

    @PostMapping("/medicinesTaken/{applicationId}")
    public ResponseEntity<Boolean> medicinesTaken(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam(value = "pharmacyMessage", required = false) String pharmacyMessage,
            @RequestParam(value = "billNo", required = false) String billNo,
            @RequestParam("consultationType") String consultationType
    ) throws ApplicationNotFoundException {

        Boolean successMessage = pharmacyService.medicinesTaken(applicationId, pharmacyMessage, billNo, consultationType);

        return ResponseEntity.ok(successMessage);

    }

}
