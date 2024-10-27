package com.Go_Work.Go_Work.Controller.Secured.PHARMACY;

import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Model.MEDICALSUPPORT.MedicalSupportResponseModel;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Service.Secured.PHARMACY.PharmacyService;
import com.Go_Work.Go_Work.Service.Secured.S3.S3Service;
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

    @GetMapping("/consultationCompleted/{applicationId}")
    public ResponseEntity<String> consultationCompleted(
            @PathVariable("applicationId") Long applicationId
    ) throws ApplicationNotFoundException {

        String successMessage = pharmacyService.consultationCompleted(applicationId);

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

}
