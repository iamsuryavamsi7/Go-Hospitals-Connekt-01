package com.Go_Work.Go_Work.Service.Secured.PHARMACY;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.BillType;
import com.Go_Work.Go_Work.Entity.Enum.NotificationStatus;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.FrontDeskUserNotFoundException;
import com.Go_Work.Go_Work.Error.NotificationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.MedicalSupportResponseModel;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.NotificationRepo;
import com.Go_Work.Go_Work.Repo.PharmacyRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import com.Go_Work.Go_Work.Service.Config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final ApplicationsRepo applicationsRepo;

    private final UserRepo userRepo;

    private final NotificationRepo notificationRepo;

    private final JwtService jwtService;

    private final PharmacyRepo pharmacyRepo;

    public MedicalSupportResponseModel fetchApplicationById(Long id) throws AppointmentNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(id).orElseThrow(
                () -> new AppointmentNotFoundException("Id Not Found")
        );

        MedicalSupportResponseModel application1 = new MedicalSupportResponseModel();

        BeanUtils.copyProperties(fetchedApplication, application1);

        User fetchedMedicalSupportUserDetails = fetchedApplication.getMedicalSupportUser();

        if ( !fetchedApplication.getBills().isEmpty() ){

            Bills latestBill = fetchedApplication.getBills()
                    .stream()
                    .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                    .findFirst()
                    .orElse(null);

            application1.setBillNo(latestBill.getBillNo());

        }

        if ( !fetchedApplication.getNextAppointmentDate().isEmpty() ){

            NextAppointmentDate latestNextAppointmentDate = fetchedApplication.getNextAppointmentDate()
                    .stream()
                    .sorted(Comparator.comparing(NextAppointmentDate::getNextFollowUpDate).reversed())
                    .findFirst()
                    .orElse(null);

            application1.setNextFollowUpDate(latestNextAppointmentDate.getNextFollowUpDate());

        }

        if ( fetchedMedicalSupportUserDetails != null ){

            application1.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
            application1.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

        } else {

            application1.setMedicalSupportUserId(null);
            application1.setMedicalSupportUserName(null);

        }

        List<ImageUrls> imageUrls = fetchedApplication.getPrescriptionUrl()
                        .stream()
                        .sorted(Comparator.comparing(ImageUrls::getTimeStamp).reversed())
                        .toList();

        application1.setPrescriptionsUrls(imageUrls);

        return application1;

    }

    public String consultationCompleted(Long applicationId, String pharmacyMessage) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setPaymentDone(true);
        fetchedApplication.setApplicationCompletedTime(new Date(System.currentTimeMillis()));
        fetchedApplication.setPaymentDoneTime(new Date(System.currentTimeMillis()));

        if ( fetchedApplication.getIsMedicationPlusFollow() ){

            fetchedApplication.setConsultationType(ConsultationType.FOLLOWUPCOMPLETED);

        }else {

            fetchedApplication.setConsultationType(ConsultationType.COMPLETED);

        }

//        fetchedApplication.setPharmacyMessage(pharmacyMessage);

        applicationsRepo.save(fetchedApplication);

        if ( fetchedApplication.getConsultationType().equals(ConsultationType.FOLLOWUPCOMPLETED) ) {

            userRepo.findAll()
                    .stream()
                    .filter(user -> user.getRole().equals(Role.FRONTDESK))
                    .forEach(user1 -> {

                        Notification notification = new Notification();

                        notification.setMessage("New Follow Up Patient Added !");
                        notification.setUser(user1);
                        notification.setRead(false);
                        notification.setTimeStamp(new Date(System.currentTimeMillis()));
                        notification.setApplicationId(fetchedApplication.getId());
                        notification.setNotificationStatus(NotificationStatus.FOLLOWUPPATIENT);

                        user1.getNotifications().add(notification);

                        userRepo.save(user1);

                    });

        }

        return "Application Completed";

    }

    public List<ApplicationsResponseModel> fetchAllPharmacyMedications() {

        return applicationsRepo.findAll()
                .stream()
                .filter(applications -> !applications.getConsultationType().equals(ConsultationType.WAITING) && !applications.getConsultationType().equals(ConsultationType.COMPLETED) && applications.getMedicalSupportUser() != null )
                .map(application1 -> {

                    ApplicationsResponseModel application = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, application);

                    User fetchedMedicalSupportUser = application1.getMedicalSupportUser();

                    application.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                    application.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                    return application;

                })
                .collect(Collectors.toList());

    }

    public List<ApplicationsResponseModel> fetchAllPharmacyCompletedMedications() {

        return applicationsRepo.findAll()
                .stream()
                .filter(applications -> applications.getConsultationType().equals(ConsultationType.COMPLETED) )
                .map(application1 -> {

                    ApplicationsResponseModel application = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, application);

                    User fetchedMedicalSupportUser = application1.getMedicalSupportUser();

                    application.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                    application.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                    return application;

                })
                .collect(Collectors.toList());

    }

    public List<ApplicationsResponseModel> fetchAllPharmacyCompletedMedicationsPaging(int pageNumber, int size) {

        Pageable pageable = PageRequest.of(pageNumber, size);

        Page<Applications> applicationsPage = applicationsRepo.findAll(pageable);

        return applicationsPage
                .stream()
                .filter(applications -> applications.getConsultationType().equals(ConsultationType.COMPLETED) )
                .map(application1 -> {

                    ApplicationsResponseModel application = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, application);

                    User fetchedMedicalSupportUser = application1.getMedicalSupportUser();

                    application.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                    application.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                    return application;

                })
                .collect(Collectors.toList());

    }

    public List<ApplicationsResponseModel> fetchAllPharmacyMedicationsPaging(int page, int pageSize) {

        List<ApplicationsResponseModel> fetchedApplications = applicationsRepo.findAll()
                            .stream()
                            .filter(Applications::getNeedMedicines)
                            .sorted(Comparator.comparing(Applications::getPharmacyGoingTime).reversed())
                            .map(application1 -> {

                                ApplicationsResponseModel application = new ApplicationsResponseModel();

                                BeanUtils.copyProperties(application1, application);

                                if ( application1.getBills() != null && !application1.getBills().isEmpty() ){

                                    Bills latestBill = application1.getBills()
                                            .stream()
                                            .sorted(Comparator.comparing(Bills::getTimeStamp))
                                            .findFirst()
                                            .orElse(null);

                                    application.setBillNo(latestBill.getBillNo());

                                }

                                if ( application1.getMedicalSupportUser() != null ){

                                    User fetchedMedicalSupportUser = application1.getMedicalSupportUser();

                                    application.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                                    application.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                                }

                                return application;

                            })
                            .collect(Collectors.toList());

        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    public String fetchUserRole(HttpServletRequest request) throws FrontDeskUserNotFoundException {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedFrontDeskUser = userRepo.findByUsername(userEmail).orElseThrow(
                () -> new FrontDeskUserNotFoundException("Front Desk User Not Found")
        );

        return fetchedFrontDeskUser.getRole().name();

    }

    public Boolean checkPendingMedicationsRefresh() {

        List<Applications> fetchedApplications = applicationsRepo.findAll();

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

    @Transactional
    public Boolean medicinesTaken(Long applicationId, String pharmacyMessage, String billNo, String consultationType) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        PharmacyMessage pharmacyMessageObject = new PharmacyMessage();

        pharmacyMessageObject.setTimeStamp(new Date(System.currentTimeMillis()));
        pharmacyMessageObject.setApplication(fetchedApplication);

        if ( !pharmacyMessage.isEmpty() ){

            pharmacyMessageObject.setPharmacyMessage(pharmacyMessage);

        }

        fetchedApplication.getPharmacyMessages().add(pharmacyMessageObject);

        Bills newBill = new Bills();

        newBill.setTimeStamp(new Date(System.currentTimeMillis()));
        newBill.setBillType(BillType.PHARMACYBILL);
        newBill.setBillNo(billNo);
        newBill.setApplications(fetchedApplication);

        fetchedApplication.getBills().add(newBill);
        fetchedApplication.setNeedMedicines(false);

        applicationsRepo.save(fetchedApplication);

        User fetchedMedicalSupportUser = fetchedApplication.getMedicalSupportUser();

        Notification notification = new Notification();

        notification.setMessage("Medicines Given !");
        notification.setUser(fetchedMedicalSupportUser);
        notification.setRead(false);
        notification.setTimeStamp(new Date(System.currentTimeMillis()));
        notification.setApplicationId(fetchedApplication.getId());
        notification.setNotificationStatus(NotificationStatus.PHARMACYMEDICINESGIVEN);

        fetchedMedicalSupportUser.getNotifications().add(notification);

        userRepo.save(fetchedMedicalSupportUser);

        if ( consultationType.equals(ConsultationType.FOLLOWUPCOMPLETED.name()) ) {

            userRepo.findAll()
                    .stream()
                    .filter(user -> user.getRole().equals(Role.FRONTDESK))
                    .forEach(user1 -> {

                        Notification notification2 = new Notification();

                        notification2.setMessage("Medicines Given !");
                        notification2.setUser(user1);
                        notification2.setRead(false);
                        notification2.setTimeStamp(new Date(System.currentTimeMillis()));
                        notification2.setApplicationId(fetchedApplication.getId());
                        notification2.setNotificationStatus(NotificationStatus.FOLLOWUPPATIENT);

                        user1.getNotifications().add(notification2);

                        userRepo.save(user1);

                    });

        }

        return true;

    }

}
