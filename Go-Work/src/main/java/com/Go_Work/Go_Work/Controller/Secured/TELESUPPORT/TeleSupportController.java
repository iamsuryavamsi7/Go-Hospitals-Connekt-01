package com.Go_Work.Go_Work.Controller.Secured.TELESUPPORT;

import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.FrontDeskUserNotFoundException;
import com.Go_Work.Go_Work.Error.NotificationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.TELESUPPORT.TeleSupportResponseModel;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Service.Secured.TELESUPPORT.TeleSupportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tele-support")
@RequiredArgsConstructor
public class TeleSupportController {

    private final TeleSupportService teleSupportService;

    @GetMapping("/fetchAllIncompleteSurgeryCarePatientsPaging/{page}/{pageSize}")
    public ResponseEntity<List<TeleSupportResponseModel>> fetchAllIncompleteSurgeryCarePatientsPaging(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize
    ){

        List<TeleSupportResponseModel> fetchedApplications = teleSupportService.fetchAllIncompleteSurgeryCarePatientsPaging(page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

    @GetMapping("/fetchApplicationById/{id}")
    public ResponseEntity<TeleSupportResponseModel> fetchApplicationById(
            @PathVariable("id") Long id
    ) throws ApplicationNotFoundException {

        TeleSupportResponseModel fetchedApplication = teleSupportService.fetchApplicationById(id);

        return ResponseEntity.ok(fetchedApplication);

    }

    @GetMapping("/assign-tele-support-user/{applicationId}")
    public ResponseEntity<String> assignTeleSupportUser(
            @PathVariable("applicationId") Long applicationId,
            HttpServletRequest request
    ) throws ApplicationNotFoundException {

        String successMessage =  teleSupportService.assignTeleSupportUser(applicationId, request);

        return ResponseEntity.ok(successMessage);

    }

    @GetMapping("/fetchMyJobsPaging/{page}/{pageSize}")
    public ResponseEntity<List<TeleSupportResponseModel>> fetchMyJobsPaging(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        List<TeleSupportResponseModel> fetchedApplications = teleSupportService.fetchMyJobsPaging(request, page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

    @GetMapping("/fetchUserObject")
    public ResponseEntity<User> fetchUserObject(
            HttpServletRequest request
    ){

        User fetchedUserObject = teleSupportService.fetchUserObject(request);

        return ResponseEntity.ok(fetchedUserObject);

    }

    @GetMapping("/fetchNotificationByUserId")
    public ResponseEntity<List<Notification>> fetchNotificationByUserId(
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        List<Notification> fetchedNotifications = teleSupportService.fetchNotificationByUserId(jwtToken);

        return ResponseEntity.ok(fetchedNotifications);

    }

    @GetMapping("/notificationSoundPlayed/{notificationID}")
    public ResponseEntity<Boolean> notificationSoundPlayed(
            @PathVariable("notificationID") Long notificationID
    ) throws NotificationNotFoundException {

        Boolean notificationPlayed = teleSupportService.notificationSoundPlayed(notificationID);

        return ResponseEntity.ok(notificationPlayed);

    }

    // API to fetch user role
    @GetMapping("/fetchUserRole")
    public ResponseEntity<String> fetchUserRole(
            HttpServletRequest request
    ) throws FrontDeskUserNotFoundException {

        String fetchedRole = teleSupportService.fetchUserRole(request);

        return ResponseEntity.ok(fetchedRole);

    }

    @GetMapping("/checkIncompletePatientsAvailableOrNot")
    public ResponseEntity<Boolean> checkIncompletePatientsAvailableOrNot(){

        Boolean booleanValue = teleSupportService.checkIncompletePatientsAvailableOrNot();

        return ResponseEntity.ok(booleanValue);

    }

    @GetMapping("/setNotificationReadByNotificationId/{notificationId}")
    public ResponseEntity<String> setNotificationReadByNotificationId(
            @PathVariable("notificationId") Long id
    ) throws NotificationNotFoundException {

        String message = teleSupportService.setNotificationReadByNotificationId(id);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/acceptSurgeryCareDocs/{applicationID}")
    public ResponseEntity<Boolean> acceptSurgeryCareDocs(
            @PathVariable("applicationID") Long applicationID
    ) throws ApplicationNotFoundException {

        Boolean booleanValue = teleSupportService.acceptSurgeryCareDocs(applicationID);

        return ResponseEntity.ok(booleanValue);

    }

    @GetMapping("/rejectSurgeryCareDocs/{applicationID}")
    public ResponseEntity<Boolean> rejectSurgeryCareDocs(
            @PathVariable("applicationID") Long applicationID
    ) throws ApplicationNotFoundException {

        Boolean booleanValue = teleSupportService.rejectSurgeryCareDocs(applicationID);

        return ResponseEntity.ok(booleanValue);

    }

    @PostMapping("/updatePaymentTypeSurgeryCareFunction/{applicationID}")
    public ResponseEntity<Boolean> updatePaymentTypeSurgeryCareFunction(
            @PathVariable("applicationID") Long applicationID,
            @RequestParam("surgeryPaymentType") String surgeryPaymentType
    ) throws ApplicationNotFoundException {

        Boolean booleanValue = teleSupportService.updatePaymentTypeSurgeryCareFunction(applicationID, surgeryPaymentType);

        return ResponseEntity.ok(booleanValue);

    }

    @PostMapping("/counsellingDone/{applicationID}")
    public ResponseEntity<Boolean> counsellingDone(
            @PathVariable("applicationID") Long applicationID,
            @RequestParam("surgeryCounsellorMessage") String surgeryCounsellorMessage,
            @RequestParam("consultationType") String consultationType
    ) throws ApplicationNotFoundException {

        Boolean booleanValue = teleSupportService.counsellingDone(applicationID, surgeryCounsellorMessage, consultationType);

        return ResponseEntity.ok(booleanValue);

    }

    @PostMapping("/surgeryCounsellingCompleted/{applicationID}")
    public ResponseEntity<Boolean> surgeryCounsellingCompleted(
            @PathVariable("applicationID") Long applicationID,
            @RequestParam(value = "counsellingMessage", required = false) String counsellingMessage,
            @RequestParam("surgeryDate") Date surgeryDate,
            @RequestParam("imageData") MultipartFile imageData
            ) throws ApplicationNotFoundException, IOException {

        Boolean booleanValue = teleSupportService.surgeryCounsellingCompleted(counsellingMessage, surgeryDate, applicationID, imageData);

        return ResponseEntity.ok(booleanValue);

    }

}
