package com.Go_Work.Go_Work.Controller.Secured.MEDICALSUPPORT;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.MedicalSupportUserNotFound;
import com.Go_Work.Go_Work.Error.NotificationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Service.Secured.MEDICALSUPPORT.MedicalSupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medical-support")
@RequiredArgsConstructor
public class MedicalSupportController {

    private final MedicalSupportService medicalSupportService;

    @GetMapping("/getAllBookingsByNotComplete")
    public ResponseEntity<List<ApplicationsResponseModel>> getAllBookingsByNotComplete(){

        List<ApplicationsResponseModel> message = medicalSupportService.getAllBookingsByNotComplete();

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

}
