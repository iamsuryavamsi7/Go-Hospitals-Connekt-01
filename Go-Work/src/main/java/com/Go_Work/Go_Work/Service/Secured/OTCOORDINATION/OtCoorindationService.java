package com.Go_Work.Go_Work.Service.Secured.OTCOORDINATION;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.NotificationStatus;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OtCoorindationService {

    private final UserRepo userRepo;

    private final ApplicationsRepo applicationsRepo;

    public List<ApplicationsResponseModel> fetchAllCurrentSurgeries(int page, int pageSize) {

        List<ApplicationsResponseModel> fetchedApplications = applicationsRepo.findAll()
                .stream()
                .filter(applications ->

//                                applications.getConsultationType().equals(ConsultationType.SURGERYCARE) &&
                                applications.getConsultationTypesData() != null &&
                                !applications.getConsultationTypesData().isEmpty() &&
                                applications.getConsultationTypesData().stream()
                                                .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                                .map(ConsultationTypesData::getConsultationType)
                                                .orElse(null) == ConsultationType.SURGERYCARE &&
                                applications.getSurgeryDate() != null &&
                                !applications.getSurgeryCompleted() &&
                                isSamyDay(applications.getSurgeryDate(), new Date()) )

                .sorted(Comparator.comparing(Applications::getSurgeryDate).reversed())
                .map(application -> {

                    ApplicationsResponseModel application1 = new ApplicationsResponseModel();

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

                    User fetchedTeleSupportUser = application.getTeleSupportUser();

                    if ( application.getTeleSupportUser() != null ){

                        application1.setTeleSupportUserId(fetchedTeleSupportUser.getId());
                        application1.setTeleSupportUserName(fetchedTeleSupportUser.getFirstName());

                    }

                    return application1;

                })
                .toList();

        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    private Boolean isSamyDay(
            Date date1,
            Date currentDate
    ){

        Calendar dateValue = Calendar.getInstance();

        dateValue.setTime(date1);

        Calendar currentDateValue = Calendar.getInstance();

        currentDateValue.setTime(currentDate);

        return dateValue.get(Calendar.YEAR) == currentDateValue.get(Calendar.YEAR) && dateValue.get(Calendar.DAY_OF_YEAR) == currentDateValue.get(Calendar.DAY_OF_YEAR);

    }

    public List<ApplicationsResponseModel> fetchAllFutureSurgeries(int page, int pageSize) {

        List<ApplicationsResponseModel> fetchedApplications = applicationsRepo.findAll()
                .stream()
                .filter(applications ->

//                                applications.getConsultationType().equals(ConsultationType.SURGERYCARE) &&
                                applications.getConsultationTypesData() != null &&
                                !applications.getConsultationTypesData().isEmpty() &&
                                applications.getConsultationTypesData().stream()
                                        .max(Comparator.comparing(ConsultationTypesData::getTimeStamp))
                                        .map(ConsultationTypesData::getConsultationType)
                                        .orElse(null) == ConsultationType.SURGERYCARE &&
                                !applications.getSurgeryCompleted() &&
                                isAfterDay(applications.getSurgeryDate(), new Date()) )

                .sorted(Comparator.comparing(Applications::getSurgeryDate))
                .map(application -> {

                    ApplicationsResponseModel application1 = new ApplicationsResponseModel();

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

                    User fetchedTeleSupportUser = application.getTeleSupportUser();

                    if ( application.getTeleSupportUser() != null ){

                        application1.setTeleSupportUserId(fetchedTeleSupportUser.getId());
                        application1.setTeleSupportUserName(fetchedTeleSupportUser.getFirstName());

                    }

                    return application1;

                })
                .toList();

        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    private Boolean isAfterDay(
            Date date1,
            Date currentDate
    ){

        Calendar dateValue = Calendar.getInstance();

        dateValue.setTime(date1);

        Calendar currentDateValue = Calendar.getInstance();

        currentDateValue.setTime(currentDate);

        return
                dateValue.get(Calendar.YEAR) > currentDateValue.get(Calendar.YEAR) ||

                dateValue.get(Calendar.YEAR) == currentDateValue.get(Calendar.YEAR)

                && dateValue.get(Calendar.DAY_OF_YEAR) > currentDateValue.get(Calendar.DAY_OF_YEAR);

    }

    public List<ApplicationsResponseModel> fetchAllCompleteApplications(int page, int pageSize) {

        List<ApplicationsResponseModel> fetchedApplications = applicationsRepo.findAll()
                .stream()
                .filter(Applications::getSurgeryCompleted)
                .sorted(Comparator.comparing(Applications::getSurgeryDate).reversed())
                .map(application -> {

                    ApplicationsResponseModel application1 = new ApplicationsResponseModel();

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

                    User fetchedTeleSupportUser = application.getTeleSupportUser();

                    if ( application.getTeleSupportUser() != null ){

                        application1.setTeleSupportUserId(fetchedTeleSupportUser.getId());
                        application1.setTeleSupportUserName(fetchedTeleSupportUser.getFirstName());

                    }

                    return application1;

                })
                .toList();

        int start = page * pageSize;
        int end = Math.min(start + pageSize, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    public Boolean surgeryStartedFunction(Long applicationID) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationID).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setSurgeryStartTime(new Date(System.currentTimeMillis()));

        applicationsRepo.save(fetchedApplication);

        return true;

    }

    public Boolean surgeryEndedFunction(Long applicationID) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationID).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setSurgeryEndTime(new Date(System.currentTimeMillis()));
        fetchedApplication.setSurgeryCompleted(true);

        applicationsRepo.save(fetchedApplication);

        User fetchedMedicalSupportUser = fetchedApplication.getMedicalSupportUser();

        Notification newNotification = new Notification();

        newNotification.setMessage("Surgery Completed !");
        newNotification.setUser(fetchedMedicalSupportUser);
        newNotification.setApplicationId(fetchedApplication.getId());
        newNotification.setNotificationStatus(NotificationStatus.BOOKAPPOINTMENT);
        newNotification.setTimeStamp(new Date(System.currentTimeMillis()));
        newNotification.setRead(false);
        newNotification.setNotificationSoundPlayed(false);

        fetchedMedicalSupportUser.getNotifications().add(newNotification);

        userRepo.save(fetchedMedicalSupportUser);

        return true;

    }
}
