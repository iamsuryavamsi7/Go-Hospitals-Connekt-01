package com.Go_Work.Go_Work.Service.Secured.MEDICALSUPPORT;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.MedicalSupportUserNotFound;
import com.Go_Work.Go_Work.Error.NotificationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.NotificationRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalSupportService {

    private final ApplicationsRepo applicationsRepo;

    private final UserRepo userRepo;

    private final NotificationRepo notificationRepo;

    public List<ApplicationsResponseModel> getAllBookingsByNotComplete() {

        return applicationsRepo.findAll()
                .stream()
                .filter(appointment -> !appointment.isAppointmentFinished())
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

        return fetchedMedicalSupportUser.getApplications();

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

}
