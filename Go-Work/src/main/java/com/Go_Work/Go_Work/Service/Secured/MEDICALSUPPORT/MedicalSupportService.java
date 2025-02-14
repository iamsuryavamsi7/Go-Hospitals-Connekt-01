package com.Go_Work.Go_Work.Service.Secured.MEDICALSUPPORT;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.NotificationStatus;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Error.*;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.ConsultationQueueMedicalSupportModel;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.ImageUrlsRepo;
import com.Go_Work.Go_Work.Repo.NotificationRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import com.Go_Work.Go_Work.Service.Config.JwtService;
import io.jsonwebtoken.lang.Strings;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalSupportService {

    private final ApplicationsRepo applicationsRepo;

    private final UserRepo userRepo;

    private final NotificationRepo notificationRepo;

    private final ImageUrlsRepo imageUrlsRepo;

    private final S3Client s3;

    private final JwtService jwtService;

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    public List<ConsultationQueueMedicalSupportModel> getAllBookingsByNotCompletePaging(int page, int pageSize) {

        List<ConsultationQueueMedicalSupportModel> fetchedApplications = applicationsRepo.findAll()
            .stream()
            .filter(appointment ->

//                    appointment.getConsultationType().equals(ConsultationType.WAITING)

                    appointment.getConsultationTypesData().stream()
                            .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                            .map(ConsultationTypesData::getConsultationType)
                            .orElse(null) == ConsultationType.WAITING

            )
            .sorted(Comparator.comparing(Applications::getAppointmentCreatedOn).reversed())
            .map(user01 -> {

                ConsultationQueueMedicalSupportModel user1 = new ConsultationQueueMedicalSupportModel();

                BeanUtils.copyProperties(user01, user1);

                if ( !user01.getBills().isEmpty() ){

                    Bills fetchedBills = user01.getBills()
                            .stream()
                            .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                            .findFirst()
                            .orElseThrow(
                                    () -> new UsernameNotFoundException("Application Not Found")
                            );

                    user1.setBillNo(fetchedBills.getBillNo());

                }

                User fetchedMedicalSupportUserDetails = user01.getMedicalSupportUser();

                if ( fetchedMedicalSupportUserDetails != null ){

                    user1.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

                } else {

                    user1.setMedicalSupportUserName(null);

                }

                return user1;

            })
            .toList();

        // Calculate pagination
        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    public ApplicationsResponseModel fetchApplicationById(Long id) throws AppointmentNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(id).orElseThrow(
                () -> new AppointmentNotFoundException("Id Not Found")
        );

        ApplicationsResponseModel application1 = new ApplicationsResponseModel();

        BeanUtils.copyProperties(fetchedApplication, application1);

        fetchedApplication.getPharmacyMessages()
                .stream()
                .sorted(Comparator.comparing(PharmacyMessage::getTimeStamp).reversed())
                .forEach(pharmacyMessageObject -> {

                    application1.getPharmacyMessages().add(pharmacyMessageObject);

                });

        if ( !fetchedApplication.getBills().isEmpty() ){

            Bills fetchedBills = fetchedApplication.getBills()
                    .stream()
                    .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                    .findFirst()
                    .orElseThrow(
                            () -> new UsernameNotFoundException("Application Not Found")
                    );

            application1.setBillNo(fetchedBills.getBillNo());

        }

        User fetchedMedicalSupportUserDetails = fetchedApplication.getMedicalSupportUser();

        if ( fetchedMedicalSupportUserDetails != null ){

            application1.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
            application1.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getUsername());

        } else {

            application1.setMedicalSupportUserId(null);
            application1.setMedicalSupportUserName(null);

        }

        ConsultationType consultationType = fetchedApplication.getConsultationTypesData().stream()
                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                .map(ConsultationTypesData::getConsultationType)
                .orElse(null);

        application1.setConsultationType(consultationType);

        return application1;

    }

    public String assignApplicationToMedicalSupportUser(Long applicationId, Long medicalSupportUserId) throws ApplicationNotFoundException, MedicalSupportUserNotFound {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        User fetchedMedicalSupportUser = userRepo.findById(medicalSupportUserId).orElseThrow(
                () -> new MedicalSupportUserNotFound("Medical Support User Not Found")
        );

        fetchedMedicalSupportUser.getApplications().add(fetchedApplication);

        userRepo.save(fetchedMedicalSupportUser);

        fetchedApplication.setMedicalSupportUser(fetchedMedicalSupportUser);

        fetchedApplication.setMedicalSupportUserAssignedTime(new Date(System.currentTimeMillis()));

        ConsultationTypesData consultationTypesData = new ConsultationTypesData();

        consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
        consultationTypesData.setConsultationType(ConsultationType.WAITING);
        consultationTypesData.setApplications(fetchedApplication);

        fetchedApplication.getConsultationTypesData().add(consultationTypesData);

        applicationsRepo.save(fetchedApplication);

        return "Application assigned to medical support user";

    }

    public List<Applications> fetchMedicalSupportJobsById(Long medicalSupportId) throws MedicalSupportUserNotFound {

        User fetchedMedicalSupportUser = userRepo.findById(medicalSupportId).orElseThrow(
                () -> new MedicalSupportUserNotFound("Medical Support User Not Found")
        );

        return fetchedMedicalSupportUser.getApplications()
                .stream()
                .filter(application ->

//                        application.getConsultationType() != ConsultationType.COMPLETED

                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.FOLLOWUPCOMPLETED

                )
                .collect(Collectors.toList());

    }

    public List<Notification> fetchNotificationByUserId(String jwtToken) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User user = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        return user.getNotifications()
                .stream()
                .sorted(Comparator.comparing(Notification::getTimeStamp).reversed())
                .limit(50)
                .toList();

    }

    public String setNotificationReadByNotificationId(Long id) throws NotificationNotFoundException {

        Notification fetchedNotification = notificationRepo.findById(id).orElseThrow(
                () -> new NotificationNotFoundException("Notification Not Found")
        );

        fetchedNotification.setRead(true);

        notificationRepo.save(fetchedNotification);

        return "Notification Read Updated Successfully";

    }

    public List<ApplicationsResponseModel> fetchAllOnsiteTreatmentData(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        List<ApplicationsResponseModel> fetchedApplicationModels =  fetchedData
                .stream()
                .filter(application -> {

//                    application.getConsultationType().equals(ConsultationType.ONSITREVIEWPATIENTDRESSING) || application.getConsultationType().equals(ConsultationType.ONSITEVASCULARINJECTIONS) || application.getConsultationType().equals(ConsultationType.ONSITEQUICKTREATMENT) || application.getConsultationType().equals(ConsultationType.ONSITECASCUALITYPATIENT)

                            ConsultationType fetchedConsultationType = application.getConsultationTypesData().stream()
                                    .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                    .map(ConsultationTypesData::getConsultationType)
                                    .orElse(null);

                            return
                                    fetchedConsultationType != null &&
                                    (

                                            fetchedConsultationType.equals(ConsultationType.ONSITREVIEWPATIENTDRESSING) ||
                                            fetchedConsultationType.equals(ConsultationType.ONSITEVASCULARINJECTIONS) ||
                                            fetchedConsultationType.equals(ConsultationType.ONSITEQUICKTREATMENT) ||
                                            fetchedConsultationType.equals(ConsultationType.ONSITECASCUALITYPATIENT)

                                    );

                })
                .sorted(Comparator.comparing(Applications::getConsultationAssignedTime).reversed())
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    if ( application1.getBills() != null && !application1.getBills().isEmpty() ){

                        Bills latestBill = application1.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        applicationNew.setBillNo(latestBill.getBillNo());

                    }

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .toList();

        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplicationModels.size());

        return fetchedApplicationModels.subList(start, end);

    }

    public List<ApplicationsResponseModel> fetchAllMedicationPlusFollowUp(Long userObjectId) {

        User fetchedMedicalUser = userRepo.findById(userObjectId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        return fetchedData
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.MEDICATIONPLUSFOLLOWUP)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.MEDICATIONPLUSFOLLOWUP

                )
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .collect(Collectors.toList());

    }

    public List<ApplicationsResponseModel> fetchAllSurgeryCare(Long userObjectId) {

        User fetchedMedicalUser = userRepo.findById(userObjectId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        return fetchedData
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.SURGERYCARE)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.SURGERYCARE

                )
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .collect(Collectors.toList());

    }

    public List<ApplicationsResponseModel> fetchAllPharmacy(Long userObjectId) {

        User fetchedMedicalUser = userRepo.findById(userObjectId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        return fetchedData
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.PHARMACY)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.PHARMACY

                )
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .collect(Collectors.toList());

    }

    public List<ApplicationsResponseModel> fetchAllCrossConsultation(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedData = fetchedMedicalUser.getApplications()
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.CROSSCONSULTATION)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.CROSSCONSULTATION

                )
                .sorted(Comparator.comparing(Applications::getConsultationAssignedTime).reversed())
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    if ( application1.getBills() != null ){

                        Bills fetchedBill = application1.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElseThrow(
                                        () -> new UsernameNotFoundException("Application Not Found")
                                );

                        applicationNew.setBillNo(fetchedBill.getBillNo());

                    }

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .toList();

        int start = page * pageSize;

        int end = Math.min(start + pageSize, fetchedData.size());

        return fetchedData.subList(start, end);

    }

    public List<ApplicationsResponseModel> fetchAllPatientAdmit(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedData = fetchedMedicalUser.getApplications()
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.PATIENTADMIT)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.PATIENTADMIT

                )
                .sorted(Comparator.comparing(Applications::getConsultationAssignedTime).reversed())
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .toList();

        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedData.size());

        return fetchedData.subList(start, end);

    }

//    public String makeConsultationType(Long applicationId, ConsultationType consultationType) throws ApplicationNotFoundException {
//
//
//        // For SURGERYCARE Consultation Type
//        if ( consultationType.equals(ConsultationType.SURGERYCARE) ){
//
//            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
//                    () -> new ApplicationNotFoundException("Application Not Found")
//            );
//
//            fetchedApplication.setConsultationType(consultationType);
//            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
//            fetchedApplication.setTeleSupportConsellingDone(false);
//
//            applicationsRepo.save(fetchedApplication);
//
//            userRepo.findAll()
//                    .stream()
//                    .filter(user -> user.getRole().equals(Role.TELESUPPORT))
//                    .forEach(fetchedUser -> {
//
//                        Notification notification = new Notification();
//
//                        notification.setApplicationId(fetchedApplication.getId());
//                        notification.setRead(false);
//                        notification.setMessage("New Counselling Request ");
//                        notification.setTimeStamp(new Date(System.currentTimeMillis()));
//                        notification.setUser(fetchedUser);
//
//                        notificationRepo.save(notification);
//
//                    });
//
//            return "Consultation Type Updated";
//
//        }
//
//        // For MEDICATIONPLUSFOLLOWUP Consultation Type
//        if ( consultationType.equals(ConsultationType.MEDICATIONPLUSFOLLOWUP)){
//
//            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
//                    () -> new ApplicationNotFoundException("Application Not Found")
//            );
//
//            fetchedApplication.setConsultationType(consultationType);
//            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
//
//            applicationsRepo.save(fetchedApplication);
//
//            return "Consultation Type updated";
//
//        }
//
//        // For Remaining Consultation Types
//        if ( !consultationType.equals(ConsultationType.PATIENTADMIT)){
//
//            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
//                    () -> new ApplicationNotFoundException("Application Not Found")
//            );
//
//            fetchedApplication.setConsultationType(consultationType);
//            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
//
//            applicationsRepo.save(fetchedApplication);
//
//            return "Consultation Type updated";
//
//        }else {
//
//            // For PATIENTADMIT Consultation Type
//            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
//                    () -> new ApplicationNotFoundException("Application Not Found")
//            );
//
//            fetchedApplication.setConsultationType(consultationType);
//            fetchedApplication.setPatientGotApproved(false);
//            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
//
//            applicationsRepo.save(fetchedApplication);
//
//            userRepo.findAll()
//                    .stream()
//                    .filter(user -> user.getRole().equals(Role.FRONTDESK))
//                    .forEach(fetchedUser -> {
//
//                        Notification notification = new Notification();
//
//                        notification.setApplicationId(fetchedApplication.getId());
//                        notification.setRead(false);
//                        notification.setMessage("New Patient Admit Request");
//                        notification.setTimeStamp(new Date(System.currentTimeMillis()));
//                        notification.setUser(fetchedUser);
//
//                        notificationRepo.save(notification);
//
//                    });
//
//            return "Consultation Type updated";
//
//        }
//
//    }

    public String makeConsultationType2(Long applicationId, ConsultationType consultationType) throws ApplicationNotFoundException, ConsultationTypeNotFoundException {

        // For Cross Consultation Type
        if ( consultationType.equals(ConsultationType.CROSSCONSULTATION)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

//            fetchedApplication.setConsultationType(consultationType);

            ConsultationTypesData consultationTypesData = new ConsultationTypesData();

            consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
            consultationTypesData.setApplications(fetchedApplication);
            consultationTypesData.setConsultationType(consultationType);

            fetchedApplication.getConsultationTypesData().add(consultationTypesData);

            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));

            applicationsRepo.save(fetchedApplication);

            userRepo.findAll()
                    .stream()
                    .filter(user -> user.getRole().equals(Role.FRONTDESK))
                    .forEach(fetchedUser -> {

                        Notification notification = new Notification();

                        notification.setApplicationId(fetchedApplication.getId());
                        notification.setRead(false);
                        notification.setMessage("Cross Consultation Request");
                        notification.setTimeStamp(new Date(System.currentTimeMillis()));
                        notification.setUser(fetchedUser);
                        notification.setNotificationStatus(NotificationStatus.CROSSCONSULTATIONNEEDED);

                        notificationRepo.save(notification);

                    });

            return "Consultation Type updated";

        }

        // For Medication Plus Follow Up Consultation Type
        if ( consultationType.equals(ConsultationType.MEDICATIONPLUSFOLLOWUP)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

//            fetchedApplication.setConsultationType(consultationType);

            ConsultationTypesData consultationTypesData = new ConsultationTypesData();

            consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
            consultationTypesData.setApplications(fetchedApplication);
            consultationTypesData.setConsultationType(consultationType);

            fetchedApplication.getConsultationTypesData().add(consultationTypesData);

            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
            fetchedApplication.setIsMedicationPlusFollow(true);

            applicationsRepo.save(fetchedApplication);

            return "Consultation Type updated";

        }

        // For Medication Plus Follow Up Consultation Type
        if ( consultationType.equals(ConsultationType.SURGERYCARE)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

            ConsultationTypesData consultationTypesData = new ConsultationTypesData();

            consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
            consultationTypesData.setApplications(fetchedApplication);
            consultationTypesData.setConsultationType(consultationType);

            fetchedApplication.getConsultationTypesData().add(consultationTypesData);

//            fetchedApplication.setConsultationType(ConsultationType.SURGERYCARE);

            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
            fetchedApplication.setTeleSupportConsellingDone(false);
            fetchedApplication.setCounsellingIsInProgress(true);
            fetchedApplication.setTeleSupportUser(null);

            applicationsRepo.save(fetchedApplication);

            userRepo.findAll()
                    .stream()
                    .filter(user -> user.getRole().equals(Role.TELESUPPORT))
                    .forEach(fetchedUser -> {

                        Notification notification = new Notification();

                        notification.setApplicationId(fetchedApplication.getId());
                        notification.setRead(false);
                        notification.setMessage("New Counselling Request !!");
                        notification.setTimeStamp(new Date(System.currentTimeMillis()));
                        notification.setUser(fetchedUser);
                        notification.setNotificationStatus(NotificationStatus.TELESUPPORTUSERPROFILE);

                        notificationRepo.save(notification);

                    });

            return "Consultation Type Updated";

        }

        // For On Site Quick Treatment Consultation Type
        if ( consultationType.equals(ConsultationType.ONSITEQUICKTREATMENT)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

//            fetchedApplication.setConsultationType(ConsultationType.ONSITEQUICKTREATMENT);

            ConsultationTypesData consultationTypesData = new ConsultationTypesData();

            consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
            consultationTypesData.setApplications(fetchedApplication);
            consultationTypesData.setConsultationType(ConsultationType.ONSITEQUICKTREATMENT);

            fetchedApplication.getConsultationTypesData().add(consultationTypesData);

            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
            fetchedApplication.setTeleSupportConsellingDone(false);

            applicationsRepo.save(fetchedApplication);

            return "Consultation Type Updated";

        }

        // For On Site Review Patient Dressing Consultation Type
        if ( consultationType.equals(ConsultationType.ONSITREVIEWPATIENTDRESSING)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

//            fetchedApplication.setConsultationType(ConsultationType.ONSITREVIEWPATIENTDRESSING);

            ConsultationTypesData consultationTypesData = new ConsultationTypesData();

            consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
            consultationTypesData.setApplications(fetchedApplication);
            consultationTypesData.setConsultationType(ConsultationType.ONSITREVIEWPATIENTDRESSING);

            fetchedApplication.getConsultationTypesData().add(consultationTypesData);

            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
            fetchedApplication.setTeleSupportConsellingDone(false);

            applicationsRepo.save(fetchedApplication);

            return "Consultation Type Updated";

        }

        // For On Site Review Patient Dressing Consultation Type
        if ( consultationType.equals(ConsultationType.ONSITEVASCULARINJECTIONS)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

//            fetchedApplication.setConsultationType(ConsultationType.ONSITEVASCULARINJECTIONS);

            ConsultationTypesData consultationTypesData = new ConsultationTypesData();

            consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
            consultationTypesData.setApplications(fetchedApplication);
            consultationTypesData.setConsultationType(ConsultationType.ONSITEVASCULARINJECTIONS);

            fetchedApplication.getConsultationTypesData().add(consultationTypesData);

            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
            fetchedApplication.setTeleSupportConsellingDone(false);
            fetchedApplication.setCounsellingIsInProgress(true);
            fetchedApplication.setTeleSupportUser(null);

            applicationsRepo.save(fetchedApplication);

            // Notify pharmacy users
            userRepo.findAll().stream()
                    .filter(user -> user.getRole().equals(Role.TELESUPPORT))
                    .forEach(pharmacyUser -> {
                        Notification newNotification = new Notification();
                        newNotification.setMessage("Review Counselling Requested !");
                        newNotification.setTimeStamp(new Date());
                        newNotification.setApplicationId(applicationId);
                        newNotification.setUser(pharmacyUser);
                        newNotification.setNotificationStatus(NotificationStatus.TELESUPPORTUSERPROFILE);

                        notificationRepo.save(newNotification);
                        pharmacyUser.getNotifications().add(newNotification);
                        userRepo.save(pharmacyUser);
                    });

            return "Consultation Type Updated";

        }

        // For On Site Review Patient Dressing Consultation Type
        if ( consultationType.equals(ConsultationType.ONSITECASCUALITYPATIENT )){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

//            fetchedApplication.setConsultationType(ConsultationType.ONSITECASCUALITYPATIENT);

            ConsultationTypesData consultationTypesData = new ConsultationTypesData();

            consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
            consultationTypesData.setApplications(fetchedApplication);
            consultationTypesData.setConsultationType(ConsultationType.ONSITECASCUALITYPATIENT);

            fetchedApplication.getConsultationTypesData().add(consultationTypesData);

            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));
            fetchedApplication.setTeleSupportConsellingDone(false);

            applicationsRepo.save(fetchedApplication);

            return "Consultation Type Updated";

        }

        throw new ConsultationTypeNotFoundException("Consultation Not Found");

    }

    public Boolean makeConsultationTypeCaseClose(Long applicationId, String caseCloseInput, String treatmentDoneMessage) throws ApplicationNotFoundException, ConsultationTypeNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

//        fetchedApplication.setConsultationType(ConsultationType.CASECLOSED);

        ConsultationTypesData consultationTypesData = new ConsultationTypesData();

        consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
        consultationTypesData.setApplications(fetchedApplication);
        consultationTypesData.setConsultationType(ConsultationType.CASECLOSED);

        fetchedApplication.getConsultationTypesData().add(consultationTypesData);

        if ( treatmentDoneMessage != null && !treatmentDoneMessage.isBlank() ){

            fetchedApplication.setTreatmentDoneMessage(treatmentDoneMessage);

        }

        fetchedApplication.setTreatmentDone(true);
        fetchedApplication.setPaymentDone(true);
        fetchedApplication.setApplicationCompletedTime(new Date(System.currentTimeMillis()));
        fetchedApplication.setPaymentDoneTime(new Date(System.currentTimeMillis()));

        if ( caseCloseInput != null && !caseCloseInput.isBlank() ){

            fetchedApplication.setCaseCloseInput(caseCloseInput);

        }

        applicationsRepo.save(fetchedApplication);

        // Notify pharmacy users
        userRepo.findAll().stream()
                .filter(user -> user.getRole().equals(Role.FRONTDESK))
                .forEach(pharmacyUser -> {
                    Notification newNotification = new Notification();
                    newNotification.setMessage("Case Closed for this application !");
                    newNotification.setTimeStamp(new Date());
                    newNotification.setApplicationId(applicationId);
                    newNotification.setUser(pharmacyUser);
                    newNotification.setNotificationStatus(NotificationStatus.CASECLOSED);

                    notificationRepo.save(newNotification);
                    pharmacyUser.getNotifications().add(newNotification);
                    userRepo.save(pharmacyUser);
                });

        return true;

    }

//    private void deleteS3Object(Applications application){
//
//        if ( application != null && application.getPrescriptionUrl() != null){
//
//            application.getPrescriptionUrl()
//                    .forEach(application1 -> {
//
//                        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
//                                .bucket(bucketName)
//                                .key(application1.getPrescriptionURL())
//                                .build();
//
//                        DeleteObjectResponse deleteObjectResponse = s3.deleteObject(objectRequest);
//
//                    });
//
//        }
//
//    }

    public String medicationPlusFollowUpTreatmentDone(
            Long applicationId,
            String prescriptionMessage,
            Date nextMedicationDate) throws ApplicationNotFoundException
    {

        Applications fetchedApplication = applicationsRepo.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application Not Found Exception"));

        if ( prescriptionMessage != null && !prescriptionMessage.isBlank() ){

            fetchedApplication.setTreatmentDoneMessage(prescriptionMessage);

        }

        fetchedApplication.setTreatmentDone(true);
//        fetchedApplication.setConsultationType(ConsultationType.FOLLOWUPCOMPLETED);

        ConsultationTypesData consultationTypesData = new ConsultationTypesData();

        consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
        consultationTypesData.setApplications(fetchedApplication);
        consultationTypesData.setConsultationType(ConsultationType.FOLLOWUPCOMPLETED);

        fetchedApplication.getConsultationTypesData().add(consultationTypesData);

        fetchedApplication.setTeleSupportUser(null);

        NextAppointmentDate nextAppointmentDate = new NextAppointmentDate();

        nextAppointmentDate.setNextFollowUpDate(nextMedicationDate);
        nextAppointmentDate.setNote("First Default Note");
        nextAppointmentDate.setApplication(fetchedApplication);

        fetchedApplication.getNextAppointmentDate().add(nextAppointmentDate);

        applicationsRepo.save(fetchedApplication);

        // Notify pharmacy users
        userRepo.findAll().stream()
                .filter(user -> user.getRole().equals(Role.FRONTDESK))
                .forEach(frontDeskUser -> {

                    Notification newNotification = new Notification();

                    newNotification.setMessage("New Follow Up Added !");
                    newNotification.setTimeStamp(new Date());
                    newNotification.setApplicationId(applicationId);
                    newNotification.setUser(frontDeskUser);
                    newNotification.setNotificationStatus(NotificationStatus.FOLLOWUPPATIENT);

                    notificationRepo.save(newNotification);

                });

        return "Prescription Uploaded Successfully";

    }


    public List<ApplicationsResponseModel> fetchMedicalPlusFollowUpData(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        List<ApplicationsResponseModel> filteredData = fetchedData
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.MEDICATIONPLUSFOLLOWUP)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.MEDICATIONPLUSFOLLOWUP

                )
                .sorted(Comparator.comparing(Applications::getConsultationAssignedTime).reversed())
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

//                    if ( !application1.getBills().isEmpty() ){
//
//                        Bills latestBill = application1.getBills()
//                                .stream()
//                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
//                                .findFirst()
//                                .orElse(null);
//
//                        applicationNew.setBillNo(latestBill.getBillNo());
//
//                    }

                    if ( !application1.getBills().isEmpty() ){

                        Bills latestBill = application1.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        applicationNew.setBillNo(latestBill.getBillNo());

                    }

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .toList();

        int start = page * pageSize;

        int end = Math.min(start + pageSize, filteredData.size());

        return filteredData.subList(start, end);

    }

    public List<ApplicationsResponseModel> fetchSurgeryCareData(
            String jwtToken,
            int page,
            int pageSize
    ) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedData = fetchedMedicalUser.getApplications()
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.SURGERYCARE)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.SURGERYCARE

                )
                .sorted(Comparator.comparing(Applications::getConsultationAssignedTime).reversed())
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    if ( application1.getBills() != null && !application1.getBills().isEmpty() ){

                        Bills latestBill = application1.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        applicationNew.setBillNo(latestBill.getBillNo());

                    }

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .toList();

        int start = page * pageSize;

        int end = Math.min(start + pageSize, fetchedData.size());

        return fetchedData.subList(start, end);

    }

    public List<ApplicationsResponseModel> fetchPharmacyData(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedData = fetchedMedicalUser.getApplications()
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.PHARMACY)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.PHARMACY

                )
                .sorted(Comparator.comparing(Applications::getConsultationAssignedTime).reversed())
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .toList();

        int start = page * pageSize;

        int end = Math.min(start + pageSize, fetchedData.size());

        return fetchedData.subList(start, end);

    }

    public List<ApplicationsResponseModel> fetchPatientAdmitData(Long userObjectId) {

        User fetchedMedicalUser = userRepo.findById(userObjectId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        return fetchedData
                .stream()
                .filter(application ->

//                        application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.PATIENTADMIT)

                        application.getConsultationTypesData() != null &&
                        application.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.PATIENTADMIT

                )
                .map(application1 -> {

                    User medicalSupportUser = application1.getMedicalSupportUser();

                    ApplicationsResponseModel applicationNew = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    applicationNew.setMedicalSupportUserId(medicalSupportUser.getId());

                    applicationNew.setMedicalSupportUserName(medicalSupportUser.getFirstName() + " " + medicalSupportUser.getLastName());

                    return applicationNew;

                })
                .collect(Collectors.toList());

    }

    public String sendRequestToFrontDeskCrossConsultation(Long applicationId) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setTreatmentDone(true);

        applicationsRepo.save(fetchedApplication);

        userRepo.findAll()
                .stream()
                .filter(user -> user.getRole().equals(Role.FRONTDESK))
                .forEach(user1 -> {

                    Notification notification = new Notification();

                    notification.setMessage("Cross Consultation Request !");
                    notification.setApplicationId(fetchedApplication.getId());
                    notification.setUser(user1);
                    notification.setTimeStamp(new Date(System.currentTimeMillis()));
                    notification.setRead(false);

                    notificationRepo.save(notification);

                });

        return "Request Sent";

    }

    public List<Applications> fetchMedicalSupportJobsByIdPaging(Long medicalSupportId, int page, int pageSize) {

        User fetchedUser = userRepo.findById(medicalSupportId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        Pageable pageable = PageRequest.of(page, pageSize);

        Page<Applications> fetchedApplications = applicationsRepo.findByMedicalSupportUser(fetchedUser, pageable);

        return fetchedApplications
                .stream()
                .filter(applications ->

//                        applications.getConsultationType() != ConsultationType.COMPLETED

                        applications.getConsultationTypesData() != null &&
                        applications.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.COMPLETED

                )
                .collect(Collectors.toList());

    }

    public List<ApplicationsResponseModel> fetchMedicalSupportJobsByIdPaging2(String jwtToken , int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedApplications = fetchedUser.getApplications()
                .stream()
                .filter(applications -> {

//                    applications.getConsultationType() != ConsultationType.COMPLETED && applications.getConsultationType() != ConsultationType.FOLLOWUPCOMPLETED && applications.getConsultationType() != ConsultationType.CASECLOSED && applications.getConsultationType() != ConsultationType.PATIENTDROPOUT

                    ConsultationType fetchedConsultationType = applications.getConsultationTypesData().stream()
                            .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                            .map(ConsultationTypesData::getConsultationType)
                            .orElse(null);

                    return

                            fetchedConsultationType != ConsultationType.COMPLETED &&
                            fetchedConsultationType != ConsultationType.FOLLOWUPCOMPLETED &&
                            fetchedConsultationType != ConsultationType.CASECLOSED &&
                            fetchedConsultationType != ConsultationType.PATIENTADMIT;

                })
                .sorted(Comparator.comparing(Applications::getMedicalSupportUserAssignedTime).reversed())
                .map(fetchedApplication -> {

                    ApplicationsResponseModel application = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(fetchedApplication, application);

                    if ( !fetchedApplication.getBills().isEmpty() ){

                        Bills fetchedBills = fetchedApplication.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        application.setBillNo(fetchedBills.getBillNo());

                    }

                    return application;

                })
                .toList();

        // Calculate pagination
        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        // Return a sublist for the requested page
        return fetchedApplications.subList(start, end);

    }

    public Boolean changeStatusToDMOCHECKCOMPLETED(Long applicationID) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationID).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        if ( fetchedApplication != null ){

//            fetchedApplication.setConsultationType(ConsultationType.DMOCARECOMPLETED);

            ConsultationTypesData consultationTypesData = new ConsultationTypesData();

            consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
            consultationTypesData.setApplications(fetchedApplication);
            consultationTypesData.setConsultationType(ConsultationType.DMOCARECOMPLETED);

            fetchedApplication.getConsultationTypesData().add(consultationTypesData);

            applicationsRepo.save(fetchedApplication);

            return true;

        }

        return false;

    }

    public String fetchUserRole(HttpServletRequest request) throws MedicalSupportUserNotFound {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new MedicalSupportUserNotFound("Medical User Not Found")
        );

        return fetchedMedicalUser.getRole().name();

    }

    public UserObject fetchUserObject(String jwtToken) {

        String extractedUserName = jwtService.extractUserName(jwtToken);

        Optional<User> fetchedUser = userRepo.findByUsername(extractedUserName);

        if ( fetchedUser.isPresent() ){

            User user = fetchedUser.get();

            UserObject newUser = new UserObject();

            BeanUtils.copyProperties(user, newUser);

            return newUser;

        }else{

            throw new UsernameNotFoundException("User Not Found");

        }

    }

    @Transactional
    public Boolean notificationSoundPlayed(Long notificationID) throws NotificationNotFoundException {

        Notification fetchedNotification = notificationRepo.findById(notificationID).orElseThrow(
                () -> new NotificationNotFoundException("Notification Not Found Exception")
        );

        if ( fetchedNotification != null ){

            fetchedNotification.setNotificationSoundPlayed(true);

            return true;

        }

        return false;

    }

    public Boolean checkWaitingPatientsAreAvailableOrNot() {

        List<Applications> fetchedApplications = applicationsRepo.findAll()
                .stream()
                .filter(applications ->

//                        applications.getConsultationType().equals(ConsultationType.WAITING)

                        applications.getConsultationTypesData() != null &&
                        applications.getConsultationTypesData().stream()
                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                .map(ConsultationTypesData::getConsultationType)
                                .orElse(null) == ConsultationType.WAITING

                )
                .toList();

        if ( !fetchedApplications.isEmpty() ){

            return true;

        }

        return false;

    }

    public Boolean sendPrescriptionToPharmacy(Long applicationId , List<MultipartFile> imageFiles, String prescriptionMessage) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application Not Found Exception"));

        // Upload each image file and collect URLs
        List<String> uploadedFilenames = imageFiles.stream()
                .map(imageFile -> {

                    try {

                        String originalFileName = imageFile.getOriginalFilename();

                        if (originalFileName != null) {

                            originalFileName = originalFileName.replace(" ", "_");

                        }

                        String fileName = System.currentTimeMillis() + "_" + originalFileName;

                        PutObjectRequest objectRequest = PutObjectRequest.builder()
                                .bucket(bucketName)
                                .key(fileName)
                                .build();
                        s3.putObject(objectRequest, RequestBody.fromInputStream(imageFile.getInputStream(), imageFile.getSize()));

                        return fileName;

                    } catch (IOException e) {

                        throw new RuntimeException("Failed to upload image to S3", e);

                    }

                })
                .toList();

        ImageUrls imageUrlObject = new ImageUrls();

        if ( prescriptionMessage != null && !prescriptionMessage.isBlank() ){

            imageUrlObject.setPrescriptionMessage(prescriptionMessage);

        }

        uploadedFilenames.forEach(file1 -> {

            imageUrlObject.getPrescriptionURL().add(file1);

        });

        imageUrlObject.setApplication(fetchedApplication);
        imageUrlObject.setTimeStamp(new Date(System.currentTimeMillis()));

        fetchedApplication.setNeedMedicines(true);
        fetchedApplication.getPrescriptionUrl().add(imageUrlObject);
        fetchedApplication.setPharmacyGoingTime(new Date(System.currentTimeMillis()));

        applicationsRepo.save(fetchedApplication);

        // Notify pharmacy users
        userRepo.findAll().stream()
                .filter(user -> user.getRole().equals(Role.PHARMACYCARE))
                .forEach(pharmacyUser -> {

                    Notification newNotification = new Notification();

                    newNotification.setMessage("Need Medicines");
                    newNotification.setTimeStamp(new Date());
                    newNotification.setApplicationId(applicationId);
                    newNotification.setUser(pharmacyUser);
                    newNotification.setNotificationStatus(NotificationStatus.PHARMACYPROFILE);

                    pharmacyUser.getNotifications().add(newNotification);

                    userRepo.save(pharmacyUser);

                });

        return true;

    }

    public Boolean onSiteTreatmentReviewPatient(Long applicationId, String treatmentDoneMessage, Date nextMedicationDate) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application Not Found Exception"));

        if ( treatmentDoneMessage != null && !treatmentDoneMessage.isBlank() ){

            fetchedApplication.setTreatmentDoneMessage(treatmentDoneMessage);

        }

        fetchedApplication.setTreatmentDone(true);
//        fetchedApplication.setConsultationType(ConsultationType.FOLLOWUPCOMPLETED);

        ConsultationTypesData consultationTypesData = new ConsultationTypesData();

        consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
        consultationTypesData.setApplications(fetchedApplication);
        consultationTypesData.setConsultationType(ConsultationType.FOLLOWUPCOMPLETED);

        fetchedApplication.getConsultationTypesData().add(consultationTypesData);

        NextAppointmentDate nextAppointmentDate = new NextAppointmentDate();

        nextAppointmentDate.setNextFollowUpDate(nextMedicationDate);
        nextAppointmentDate.setNote("First Default Note");
        nextAppointmentDate.setApplication(fetchedApplication);

        fetchedApplication.getNextAppointmentDate().add(nextAppointmentDate);

        applicationsRepo.save(fetchedApplication);

        // Notify pharmacy users
        userRepo.findAll().stream()
                .filter(user -> user.getRole().equals(Role.FRONTDESK))
                .forEach(frontDeskUser -> {

                    Notification newNotification = new Notification();

                    newNotification.setMessage("New Follow Up Added !");
                    newNotification.setTimeStamp(new Date());
                    newNotification.setApplicationId(applicationId);
                    newNotification.setUser(frontDeskUser);
                    newNotification.setNotificationStatus(NotificationStatus.FOLLOWUPPATIENT);

                    notificationRepo.save(newNotification);

                });

        return true;

    }

    public Boolean patientDropOutById(Long applicationId, String patientDropOutMessage, String consultationType) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

//        fetchedApplication.setConsultationType(ConsultationType.PATIENTDROPOUT);

        ConsultationTypesData consultationTypesData = new ConsultationTypesData();

        consultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
        consultationTypesData.setConsultationType(ConsultationType.PATIENTDROPOUT);
        consultationTypesData.setApplications(fetchedApplication);

        fetchedApplication.getConsultationTypesData().add(consultationTypesData);

        fetchedApplication.setTreatmentDone(true);
        fetchedApplication.setPaymentDone(true);
        fetchedApplication.setApplicationCompletedTime(new Date(System.currentTimeMillis()));
        fetchedApplication.setPaymentDoneTime(new Date(System.currentTimeMillis()));
        fetchedApplication.setPatientDropOutMessage(patientDropOutMessage);

        applicationsRepo.save(fetchedApplication);

        // Notify pharmacy users
        userRepo.findAll().stream()
                .filter(user -> user.getRole().equals(Role.FRONTDESK))
                .forEach(pharmacyUser -> {
                    Notification newNotification = new Notification();
                    newNotification.setMessage("Patient Dropped Out !");
                    newNotification.setTimeStamp(new Date());
                    newNotification.setApplicationId(applicationId);
                    newNotification.setUser(pharmacyUser);
                    newNotification.setNotificationStatus(NotificationStatus.DROPOUTPATIENT);

                    notificationRepo.save(newNotification);
                    pharmacyUser.getNotifications().add(newNotification);
                    userRepo.save(pharmacyUser);
                });

        User fetchedMedicalUser = fetchedApplication.getMedicalSupportUser();

        if ( consultationType.equals(ConsultationType.CROSSCONSULTATION.name()) ){

            Notification newNotification = new Notification();
            newNotification.setMessage("New Patient Added");
            newNotification.setTimeStamp(new Date(System.currentTimeMillis()));
            newNotification.setApplicationId(fetchedApplication.getId());
            newNotification.setRead(false);
            newNotification.setUser(fetchedMedicalUser);
            newNotification.setNotificationStatus(NotificationStatus.CASECLOSED);

            notificationRepo.save(newNotification);

            fetchedMedicalUser.getNotifications().add(newNotification);

            userRepo.save(fetchedMedicalUser);

        }

        return true;

    }

}
