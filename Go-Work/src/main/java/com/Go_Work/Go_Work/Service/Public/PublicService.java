package com.Go_Work.Go_Work.Service.Public;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Enum.NotificationStatus;
import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Entity.SurgeryDocumentsUrls;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.NotificationRepo;
import com.Go_Work.Go_Work.Repo.SurgeryDocumentsUrlsRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicService {

    private final UserRepo userRepo;

    private final ApplicationsRepo applicationsRepo;

    private final S3Client s3;

    private final SurgeryDocumentsUrlsRepo surgeryDocumentsUrlsRepo;

    private final NotificationRepo notificationRepo;

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

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

    @Transactional
    public String uploadSurgeryDocuments(Long applicationId, List<MultipartFile> imageFiles, Long userId) throws Exception {

        Applications fetchedApplication = applicationsRepo.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application Not Found Exception"));

        if ( fetchedApplication.isTeleSupportSurgeryDocumentsAccept() ){

            // Clear the previous URLs
            deleteS3Object(fetchedApplication);

            // Upload each image file and collect URLs
            List<SurgeryDocumentsUrls> uploadedFilenames = imageFiles.stream()
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

                            SurgeryDocumentsUrls surgeryDocumentsUrl = new SurgeryDocumentsUrls();

                            surgeryDocumentsUrl.setSurgeryDocumentsUrl(fileName);

                            surgeryDocumentsUrl.setApplication(fetchedApplication);

                            return surgeryDocumentsUrlsRepo.save(surgeryDocumentsUrl);

                        } catch (IOException e) {
                            throw new RuntimeException("Failed to upload image to S3", e);
                        }
                    })
                    .toList();

            fetchedApplication.getSurgeryDocumentsUrls().forEach(surgeryDocumentsUrlsRepo::delete);

            fetchedApplication.getSurgeryDocumentsUrls().clear();
            fetchedApplication.getSurgeryDocumentsUrls().addAll(uploadedFilenames);

            applicationsRepo.save(fetchedApplication);

            // Notify pharmacy users
            User fetchedTeleSupportUser = userRepo.findById(userId).orElseThrow(
                    () -> new UsernameNotFoundException("User Not Found")
            );

            Notification newNotification = new Notification();

            newNotification.setMessage("Documents Uploaded Successfully");
            newNotification.setTimeStamp(new Date());
            newNotification.setApplicationId(applicationId);
            newNotification.setUser(fetchedTeleSupportUser);
            newNotification.setNotificationStatus(NotificationStatus.TELESUPPORTUSERPROFILE);

            notificationRepo.save(newNotification);

            fetchedTeleSupportUser.getNotifications().add(newNotification);

            userRepo.save(fetchedTeleSupportUser);

            return "Prescription Uploaded Successfully";

        }

        throw new Exception("Not Permitted");

    }

}
