package com.Go_Work.Go_Work.Service.Secured.TELESUPPORT;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.FrontDeskUserNotFoundException;
import com.Go_Work.Go_Work.Error.NotificationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.TELESUPPORT.TeleSupportResponseModel;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
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
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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

                    if ( !application.getBills().isEmpty() ){

                        Bills latestBill = application.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        application1.setBillNo(latestBill.getBillNo());

                    }

                    User fetchedMedicalSupportUser = application.getMedicalSupportUser();

                    if ( fetchedMedicalSupportUser != null ){

                        application1.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                        application1.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                    } else {

                        application1.setMedicalSupportUserId(null);
                        application1.setMedicalSupportUserName(null);

                    }

                    if ( application.getTeleSupportUser() != null ){

                        application1.setTeleSupportUserId(application.getTeleSupportUser().getId());
                        application1.setTeleSupportUserName(application.getTeleSupportUser().getFirstName());

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

        if ( !fetchedApplication.getBills().isEmpty() ){

            Bills latestBill = fetchedApplication.getBills()
                    .stream()
                    .sorted(Comparator.comparing(Bills::getTimeStamp))
                    .findFirst()
                    .orElse(null);

            newApplication1.setBillNo(latestBill.getBillNo());

        }

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

    public String assignTeleSupportUser(Long applicationId, HttpServletRequest request) throws ApplicationNotFoundException {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setTeleSupportSurgeryDocumentsAccept(false);

        fetchedApplication.setTeleSupportUser(fetchedUser);

        fetchedApplication.setTeleSupportUserAssignedTime(new Date(System.currentTimeMillis()));

        fetchedUser.getTeleSupportApplications().add(fetchedApplication);

        userRepo.save(fetchedUser);

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

                    if ( !application.getBills().isEmpty() ){

                        Bills latestBill = application.getBills()
                                        .stream()
                                        .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                        .findFirst()
                                        .orElse(null);


                        newApplication1.setBillNo(latestBill.getBillNo());

                    }

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

    public UserObject fetchUserObject(HttpServletRequest request) {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String extractedUserName = jwtService.extractUserName(jwtToken);

        Optional<User> fetchedUser = userRepo.findByEmail(extractedUserName);

        if ( fetchedUser.isPresent() ){

            User user = fetchedUser.get();

            UserObject newUser = new UserObject();

            BeanUtils.copyProperties(user, newUser);

            return newUser;

        }else{

            throw new UsernameNotFoundException("User Not Found");

        }

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

    public String fetchUserRole(HttpServletRequest request) throws FrontDeskUserNotFoundException {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedFrontDeskUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new FrontDeskUserNotFoundException("Front Desk User Not Found")
        );

        return fetchedFrontDeskUser.getRole().name();

    }

    public Boolean checkIncompletePatientsAvailableOrNot() {

        List<Applications> fetchedApplications = applicationsRepo.findAll()
                .stream()
                .filter(application1 -> application1.getConsultationType().equals(ConsultationType.SURGERYCARE) && !application1.isTeleSupportConsellingDone())
                .toList();

        if ( !fetchedApplications.isEmpty() ){

            return true;

        }

        return false;

    }

    public String setNotificationReadByNotificationId(Long id) throws NotificationNotFoundException {

        Notification fetchedNotification = notificationRepo.findById(id).orElseThrow(
                () -> new NotificationNotFoundException("Notification Not Found")
        );

        fetchedNotification.setRead(true);

        notificationRepo.save(fetchedNotification);

        return "Notification Read Updated Successfully";

    }

    public Boolean acceptSurgeryCareDocs(Long applicationID) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationID).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setTeleSupportSurgeryDocumentsAccept(true);

        applicationsRepo.save(fetchedApplication);

        return true;

    }

    public Boolean rejectSurgeryCareDocs(Long applicationID) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationID).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setTeleSupportSurgeryDocumentsAccept(false);

        applicationsRepo.save(fetchedApplication);

        return true;


    }

}
