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
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
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

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    public List<ApplicationsResponseModel> getAllBookingsByNotComplete() {

        return applicationsRepo.findAll()
                .stream()
                .filter(appointment -> appointment.getConsultationType() != null && appointment.getConsultationType().equals(ConsultationType.WAITING))
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
                .collect(Collectors.toList());

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

    public List<Notification> fetchNotificationByUserId(Long userId) {

        User fetchedUser =  userRepo.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        return fetchedUser.getNotifications();

    }

    public String setNotificationReadByNotificationId(Long id) throws NotificationNotFoundException {

        Notification fetchedNotification = notificationRepo.findById(id).orElseThrow(
                () -> new NotificationNotFoundException("Notification Not Found")
        );

        fetchedNotification.setRead(true);

        notificationRepo.save(fetchedNotification);

        return "Notification Reading Successfull";

    }

    public List<ApplicationsResponseModel> fetchAllOnsiteTreatmentData(Long userObjectId) {

        User fetchedMedicalUser = userRepo.findById(userObjectId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        return fetchedData
                .stream()
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.ONSITETREATMENT))
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

    public List<ApplicationsResponseModel> fetchAllCrossConsultation(Long userObjectId) {

        User fetchedMedicalUser = userRepo.findById(userObjectId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<Applications> fetchedData = fetchedMedicalUser.getApplications();

        return fetchedData
                .stream()
                .filter(application -> application.getConsultationType() != null && application.getConsultationType().equals(ConsultationType.CROSSCONSULTATION))
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

    public List<ApplicationsResponseModel> fetchAllPatientAdmit(Long userObjectId) {

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

    public String makeConsultationType(Long applicationId, ConsultationType consultationType) throws ApplicationNotFoundException {

        if ( consultationType.equals(ConsultationType.MEDICATIONPLUSFOLLOWUP)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

            fetchedApplication.setConsultationType(consultationType);
            fetchedApplication.setMedicationPlusFollowUp(true);

            applicationsRepo.save(fetchedApplication);

            return "Consultation Type updated";

        }

        if (!consultationType.equals(ConsultationType.PATIENTADMIT)){

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

            fetchedApplication.setConsultationType(consultationType);

            applicationsRepo.save(fetchedApplication);

            return "Consultation Type updated";

        }else {

            Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                    () -> new ApplicationNotFoundException("Application Not Found")
            );

            fetchedApplication.setConsultationType(consultationType);
            fetchedApplication.setPatientGotApproved(false);

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


    public List<ApplicationsResponseModel> fetchMedicalPlusFollowUpData(Long userObjectId) {

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

    public List<ApplicationsResponseModel> fetchSurgeryCareData(Long userObjectId) {

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

    public List<ApplicationsResponseModel> fetchPharmacyData(Long userObjectId) {

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
}
