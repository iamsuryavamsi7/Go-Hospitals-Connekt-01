package com.Go_Work.Go_Work.Service.Secured.MEDICALSUPPORT;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.ImageUrls;
import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.MedicalSupportUserNotFound;
import com.Go_Work.Go_Work.Error.NotificationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.ImageUrlsRepo;
import com.Go_Work.Go_Work.Repo.NotificationRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import com.Go_Work.Go_Work.Service.Config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
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

    public List<ApplicationsResponseModel> getAllBookingsByNotCompletePaging(int page, int pageSize) {

        List<ApplicationsResponseModel> fetchedApplications = applicationsRepo.findAll()
            .stream()
            .filter(appointment -> appointment.getConsultationType() != null && appointment.getConsultationType().equals(ConsultationType.WAITING))
            .sorted(Comparator.comparing(Applications::getAppointmentCreatedOn).reversed())
            .map(user01 -> {

                ApplicationsResponseModel user1 = new ApplicationsResponseModel();

                BeanUtils.copyProperties(user01, user1);

                User fetchedMedicalSupportUserDetails = user01.getMedicalSupportUser();

                if ( fetchedMedicalSupportUserDetails != null ){

                    user1.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
                    user1.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

                } else {

                    user1.setMedicalSupportUserId(null);
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

        User fetchedMedicalSupportUserDetails = fetchedApplication.getMedicalSupportUser();

        if ( fetchedMedicalSupportUserDetails != null ){

            application1.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
            application1.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

        } else {

            application1.setMedicalSupportUserId(null);
            application1.setMedicalSupportUserName(null);

        }

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

        applicationsRepo.save(fetchedApplication);

        return "Application assigned to medical support user";

    }

    public List<Applications> fetchMedicalSupportJobsById(Long medicalSupportId) throws MedicalSupportUserNotFound {

        User fetchedMedicalSupportUser = userRepo.findById(medicalSupportId).orElseThrow(
                () -> new MedicalSupportUserNotFound("Medical Support User Not Found")
        );

        return fetchedMedicalSupportUser.getApplications()
                .stream()
                .filter(application -> application.getConsultationType() != ConsultationType.COMPLETED)
                .collect(Collectors.toList());

    }

    public List<Notification> fetchNotificationByUserId(String jwtToken) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User user = userRepo.findByEmail(userEmail).orElseThrow(
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

        return "Notification Reading Successfull";

    }

    public List<ApplicationsResponseModel> fetchAllOnsiteTreatmentData(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        List<ApplicationsResponseModel> fetchedApplicationModels =  fetchedData
                .stream()
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.ONSITETREATMENT))
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
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.MEDICATIONPLUSFOLLOWUP))
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
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.SURGERYCARE))
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
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.PHARMACY))
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

        User fetchedMedicalUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedData = fetchedMedicalUser.getApplications()
                .stream()
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.CROSSCONSULTATION))
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

    public List<ApplicationsResponseModel> fetchAllPatientAdmit(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedData = fetchedMedicalUser.getApplications()
                .stream()
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.PATIENTADMIT))
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

    public String makeConsultationType(Long applicationId, ConsultationType consultationType) throws ApplicationNotFoundException {

        if ( consultationType.equals(ConsultationType.MEDICATIONPLUSFOLLOWUP)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

            fetchedApplication.setConsultationType(consultationType);
            fetchedApplication.setMedicationPlusFollowUp(true);
            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));

            applicationsRepo.save(fetchedApplication);

            return "Consultation Type updated";

        }

        if ( !consultationType.equals(ConsultationType.PATIENTADMIT)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

            fetchedApplication.setConsultationType(consultationType);
            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));

            applicationsRepo.save(fetchedApplication);

            return "Consultation Type updated";

        }else {

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

            fetchedApplication.setConsultationType(consultationType);
            fetchedApplication.setPatientGotApproved(false);
            fetchedApplication.setConsultationAssignedTime(new Date(System.currentTimeMillis()));

            applicationsRepo.save(fetchedApplication);

            userRepo.findAll()
                    .stream()
                    .filter(user -> user.getRole().equals(Role.FRONTDESK))
                    .forEach(fetchedUser -> {

                        Notification notification = new Notification();

                        notification.setApplicationId(fetchedApplication.getId());
                        notification.setRead(false);
                        notification.setMessage("New Patient Admit Request");
                        notification.setTimeStamp(new Date(System.currentTimeMillis()));
                        notification.setUser(fetchedUser);

                        notificationRepo.save(notification);

                    });

            return "Consultation Type updated";

        }

    }



    private void deleteS3Object(Applications application){

        if ( application != null && application.getPrescriptionUrl() != null){

            application.getPrescriptionUrl()
                    .forEach(application1 -> {

                        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                                .bucket(bucketName)
                                .key(application1.getPrescriptionURL())
                                .build();

                        DeleteObjectResponse deleteObjectResponse = s3.deleteObject(objectRequest);

                    });

        }

    }

    public String uploadPrescription(
            Long applicationId,
            List<MultipartFile> imageFiles,
            String prescriptionMessage) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application Not Found Exception"));

        // Clear the previous URLs
        deleteS3Object(fetchedApplication);

        // Upload each image file and collect URLs
        List<ImageUrls> uploadedFilenames = imageFiles.stream()
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

                        ImageUrls imageUrl = new ImageUrls();

                        imageUrl.setPrescriptionURL(fileName);

                        imageUrl.setApplication(fetchedApplication);

                        return imageUrlsRepo.save(imageUrl);

                    } catch (IOException e) {
                        throw new RuntimeException("Failed to upload image to S3", e);
                    }
                })
                .toList();

        // Update the fetched application's prescription URL list
        fetchedApplication.getPrescriptionUrl().clear();
        fetchedApplication.getPrescriptionUrl().addAll(uploadedFilenames);
        fetchedApplication.setTreatmentDoneMessage(prescriptionMessage);
        fetchedApplication.setTreatmentDone(true);

        applicationsRepo.save(fetchedApplication);

        // Notify pharmacy users
        userRepo.findAll().stream()
                .filter(user -> user.getRole().equals(Role.PHARMACYCARE))
                .forEach(pharmacyUser -> {
                    Notification newNotification = new Notification();
                    newNotification.setMessage("Treatment done and need medicines");
                    newNotification.setTimeStamp(new Date());
                    newNotification.setApplicationId(applicationId);
                    newNotification.setUser(pharmacyUser);
                    notificationRepo.save(newNotification);
                    pharmacyUser.getNotifications().add(newNotification);
                    userRepo.save(pharmacyUser);
                });

        return "Prescription Uploaded Successfully";
    }


    public List<ApplicationsResponseModel> fetchMedicalPlusFollowUpData(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        List<ApplicationsResponseModel> filteredData = fetchedData
                .stream()
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.MEDICATIONPLUSFOLLOWUP))
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

        int end = Math.min(start + pageSize, filteredData.size());

        return filteredData.subList(start, end);

    }

    public List<ApplicationsResponseModel> fetchSurgeryCareData(
            String jwtToken,
            int page,
            int pageSize
    ) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedData = fetchedMedicalUser.getApplications()
                .stream()
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.SURGERYCARE))
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

    public List<ApplicationsResponseModel> fetchPharmacyData(String jwtToken, int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedMedicalUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<ApplicationsResponseModel> fetchedData = fetchedMedicalUser.getApplications()
                .stream()
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.PHARMACY))
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
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.PATIENTADMIT))
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

        fetchedApplication.setForCrossConsultation(true);

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

//                    user1.getNotifications().add(notification);
//
//                    userRepo.save(user1);

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
                .filter(applications -> applications.getConsultationType() != ConsultationType.COMPLETED )
                .collect(Collectors.toList());

    }

    public List<Applications> fetchMedicalSupportJobsByIdPaging2(String jwtToken , int page, int pageSize) {

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedApplications = fetchedUser.getApplications()
                .stream()
                .filter(applications -> applications.getConsultationType() != ConsultationType.COMPLETED)
                .sorted(Comparator.comparing(applications -> applications.getConsultationType() == ConsultationType.WAITING ? 0 : 1))
                .toList();

        // Calculate pagination
        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        // Return a sublist for the requested page
        return fetchedApplications.subList(start, end);

    }

}
