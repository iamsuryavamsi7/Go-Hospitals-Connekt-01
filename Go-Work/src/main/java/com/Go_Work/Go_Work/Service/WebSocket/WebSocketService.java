package com.Go_Work.Go_Work.Service.WebSocket;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.NotificationStatus;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.FetchPatientDataResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.AcceptCrossConsultationModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.BookAppointmentWebSocketModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.ConsultationQueueMedicalSupportModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.CrossConsultationApplicationIDModel;
import com.Go_Work.Go_Work.Repo.*;
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

    private final BillsRepo billsRepo;

    public TemporaryAppointmentDataEntity saveOnBoardData(FetchPatientDataResponseModel fetchPatientDataResponseModel) {

        TemporaryAppointmentDataEntity temporaryAppointmentData = new TemporaryAppointmentDataEntity();

        BeanUtils.copyProperties(fetchPatientDataResponseModel, temporaryAppointmentData);

        return temporaryAppointmentDataRepo.save(temporaryAppointmentData);

    }

    @Transactional
    public Notification sendRequestToFrontDeskCrossConsultation(CrossConsultationApplicationIDModel crossConsultationApplicationIDModel) throws ApplicationNotFoundException {

        Notification notification = new Notification();

        notification.setNotificationStatus(NotificationStatus.CROSSCONSULTATIONNEEDED);

        return notification;

    }

    @Transactional
    public Notification acceptCrossConsultation(AcceptCrossConsultationModel acceptCrossConsultationModel) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(acceptCrossConsultationModel.getApplicationId()).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

//        fetchedApplication.setConsultationType(ConsultationType.WAITING);

        ConsultationTypesData newConsultationTypesData = new ConsultationTypesData();

        newConsultationTypesData.setTimeStamp(new Date(System.currentTimeMillis()));
        newConsultationTypesData.setConsultationType(ConsultationType.WAITING);
        newConsultationTypesData.setApplications(fetchedApplication);

        fetchedApplication.getConsultationTypesData().add(newConsultationTypesData);

        fetchedApplication.setMedicalSupportUser(null);
        fetchedApplication.setTreatmentDone(false);
        fetchedApplication.setApplicationCompletedTime(null);
        fetchedApplication.setPaymentDone(false);
        fetchedApplication.setPatientGotApproved(true);
        fetchedApplication.setAppointmentCreatedOn(new Date(System.currentTimeMillis()));
        fetchedApplication.setReasonForVisit(acceptCrossConsultationModel.getReasonForVisit());
        fetchedApplication.setPreferredDoctorName(acceptCrossConsultationModel.getDoctorName());

        Bills bills = new Bills();
        bills.setBillNo(acceptCrossConsultationModel.getBillNo());
        bills.setTimeStamp(new Date(System.currentTimeMillis()));
        bills.setApplications(fetchedApplication);

        fetchedApplication.getBills().add(bills);

        applicationsRepo.save(fetchedApplication);

        userRepo.findAll()
                .stream()
                .filter(users -> users.getRole().equals(Role.MEDICALSUPPORT))
                .forEach(user -> {

                    Notification notification = new Notification();

                    notification.setMessage("New Application Booked");
                    notification.setTimeStamp(new Date(System.currentTimeMillis()));
                    notification.setApplicationId(acceptCrossConsultationModel.getApplicationId());
                    notification.setNotificationStatus(NotificationStatus.BOOKAPPOINTMENT);
                    notification.setRead(false);
                    notification.setUser(user);

                    notificationRepo.save(notification);

                });

        Notification notification = new Notification();

        notification.setNotificationStatus(NotificationStatus.BOOKAPPOINTMENT);

        return notification;

    }

}
