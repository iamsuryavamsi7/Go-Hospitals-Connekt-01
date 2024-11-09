package com.Go_Work.Go_Work.Service.Secured.TELESUPPORT;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.TELESUPPORT.TeleSupportResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.NotificationRepo;
import com.Go_Work.Go_Work.Repo.SurgeryDocumentsUrlsRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import com.Go_Work.Go_Work.Service.Config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
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
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeleSupportService {

    private final ApplicationsRepo applicationsRepo;

    private final JwtService jwtService;

    private final UserRepo userRepo;

    private final S3Client s3;

    private final SurgeryDocumentsUrlsRepo surgeryDocumentsUrlsRepo;

    private final NotificationRepo notificationRepo;

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    public List<TeleSupportResponseModel> fetchAllIncompleteSurgeryCarePatientsPaging(int page, int pageSize) {

        List<TeleSupportResponseModel> fetchedApplications = applicationsRepo.findAll()
                .stream()
                .filter(applications -> applications.getConsultationType().equals(ConsultationType.SURGERYCARE) && !applications.isTeleSupportConsellingDone() )
                .sorted(Comparator.comparing(Applications::getConsultationAssignedTime).reversed())
                .map(application -> {

                    TeleSupportResponseModel application1 = new TeleSupportResponseModel();

                    BeanUtils.copyProperties(application, application1);

                    User fetchedMedicalSupportUser = application.getMedicalSupportUser();

                    if ( fetchedMedicalSupportUser != null ){

                        application1.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                        application1.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                    } else {

                        application1.setMedicalSupportUserId(null);
                        application1.setMedicalSupportUserName(null);

                    }

                    return application1;

                })
                .toList();

        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    public TeleSupportResponseModel fetchApplicationById(Long id) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(id).orElseThrow(
            () -> new ApplicationNotFoundException("Application Not Found")
        );

        TeleSupportResponseModel newApplication1 = new TeleSupportResponseModel();

        BeanUtils.copyProperties(fetchedApplication, newApplication1);

        User fetchedMedicalSupportUser = fetchedApplication.getMedicalSupportUser();

        if ( fetchedMedicalSupportUser != null ){

            newApplication1.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
            newApplication1.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

        }

        User fetchedTeleSupportUser = fetchedApplication.getTeleSupportUser();

        if ( fetchedTeleSupportUser != null ){

            newApplication1.setTeleSupportUserId(fetchedTeleSupportUser.getId());
            newApplication1.setTeleSupportUserName(fetchedTeleSupportUser.getFirstName() + " " + fetchedTeleSupportUser.getLastName());

        }

        return newApplication1;

    }

    public String assignTeleSupportUser(Long id, HttpServletRequest request) throws ApplicationNotFoundException {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        Applications fetchedApplication = applicationsRepo.findById(id).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedUser.getTeleSupportApplications().add(fetchedApplication);

        fetchedApplication.setTeleSupportUser(fetchedUser);

        fetchedApplication.setTeleSupportUserAssignedTime(new Date(System.currentTimeMillis()));

        userRepo.save(fetchedUser);

        applicationsRepo.save(fetchedApplication);

        return "Assignment Successfully";

    }

    public List<TeleSupportResponseModel> fetchMyJobsPaging(HttpServletRequest request, int page, int pageSize) {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedTeleSupportUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        List<TeleSupportResponseModel> fetchedApplications = fetchedTeleSupportUser.getTeleSupportApplications()
                .stream()
                .filter(applications -> !applications.isTreatmentDone() )
                .sorted(Comparator.comparing(Applications::getTeleSupportUserAssignedTime).reversed())
                .map(application -> {

                    TeleSupportResponseModel newApplication1 = new TeleSupportResponseModel();

                    BeanUtils.copyProperties(application, newApplication1);

                    User fetchedMedicalSupportUser = application.getMedicalSupportUser();

                    if ( fetchedMedicalSupportUser != null ){

                        newApplication1.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                        newApplication1.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                    }

                    User fetchedTeleSupportUserFromApplication = application.getTeleSupportUser();

                    if ( fetchedTeleSupportUserFromApplication != null ){

                        newApplication1.setTeleSupportUserId(fetchedTeleSupportUserFromApplication.getId());
                        newApplication1.setTeleSupportUserName(fetchedTeleSupportUserFromApplication.getFirstName() + " " + fetchedTeleSupportUserFromApplication.getLastName());

                    }

                    return newApplication1;

                })
                .toList();

        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

}
