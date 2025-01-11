package com.Go_Work.Go_Work.Service.WebSocket;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.NotificationStatus;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Entity.TemporaryAppointmentDataEntity;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.FetchPatientDataResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.BookAppointmentWebSocketModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.ConsultationQueueMedicalSupportModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.NotificationRepo;
import com.Go_Work.Go_Work.Repo.TemporaryAppointmentDataRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final TemporaryAppointmentDataRepo temporaryAppointmentDataRepo;

    private final ApplicationsRepo applicationsRepo;

    private final UserRepo userRepo;

    private final NotificationRepo notificationRepo;

    public TemporaryAppointmentDataEntity saveOnBoardData(FetchPatientDataResponseModel fetchPatientDataResponseModel) {

        TemporaryAppointmentDataEntity temporaryAppointmentData = new TemporaryAppointmentDataEntity();

        BeanUtils.copyProperties(fetchPatientDataResponseModel, temporaryAppointmentData);

        return temporaryAppointmentDataRepo.save(temporaryAppointmentData);

    }

    @Transactional
    public Notification bookAppointmentSendToMedicalSupportUser(BookAppointmentWebSocketModel bookAppointmentWebSocketModel) {

        Applications applications = new Applications();

        BeanUtils.copyProperties(bookAppointmentWebSocketModel, applications);

        // Set appointment details
        applications.setAppointmentCreatedOn(new Date(System.currentTimeMillis()));
        applications.setConsultationType(ConsultationType.WAITING);
        applications.setTreatmentDone(false);
        applications.setPaymentDone(false);
        applications.setPatientGotApproved(true);
        applications.setMedicationPlusFollowUp(false);
        applications.setForCrossConsultation(false);

        temporaryAppointmentDataRepo.deleteById(bookAppointmentWebSocketModel.getDeleteAppointmentID());

        // Save the appointment
        Applications savedApplication = applicationsRepo.save(applications);

        Long applicationId = savedApplication.getId();

        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMyy");

        String formatedDate = currentDate.format(formatter);

        String patientID = formatedDate + applicationId;

        applications.setPatientId(patientID);

        userRepo.findAll()
                .stream()
                .filter( user -> user.getRole().equals(Role.MEDICALSUPPORT) )
                .forEach(medicalUser -> {

                    Notification newNotification = new Notification();

                    newNotification.setMessage("New Application Booked");
                    newNotification.setTimeStamp(new Date(System.currentTimeMillis()));
                    newNotification.setApplicationId(applicationId);
                    newNotification.setRead(false);
                    newNotification.setUser(medicalUser);
                    newNotification.setNotificationSoundPlayed(false);
                    newNotification.setNotificationStatus(NotificationStatus.BOOKAPPOINTMENT);

                    notificationRepo.save(newNotification);

                    medicalUser.getNotifications().add(newNotification);

                    userRepo.save(medicalUser);

                });

        Notification newNotification = new Notification();

        newNotification.setMessage("New Application Booked");
        newNotification.setTimeStamp(new Date(System.currentTimeMillis()));
        newNotification.setApplicationId(applicationId);
        newNotification.setRead(false);
        newNotification.setNotificationSoundPlayed(false);
        newNotification.setNotificationStatus(NotificationStatus.BOOKAPPOINTMENT);

        return newNotification;

    }

}
