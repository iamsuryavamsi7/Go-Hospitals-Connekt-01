package com.Go_Work.Go_Work.Service.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Error.*;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.FetchPatientDataResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.MedicalSupportResponseModel;
import com.Go_Work.Go_Work.Repo.*;
import com.Go_Work.Go_Work.Service.Config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FrontDeskService {

    private final ApplicationsRepo applicationsRepo;

    private final DepartmentRepo departmentRepo;

    private final UserRepo userRepo;

    private final NotificationRepo notificationRepo;

    private final JwtService jwtService;

    private final TemporaryAppointmentDataRepo temporaryAppointmentDataRepo;

    public String fetchUserRole(HttpServletRequest request) throws FrontDeskUserNotFoundException {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedFrontDeskUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new FrontDeskUserNotFoundException("Front Desk User Not Found")
        );

        return fetchedFrontDeskUser.getRole().name();

    }











    public String bookAppointment(Applications applications, Long temporaryAppointmentID) {

        // Set appointment details
        applications.setAppointmentCreatedOn(new Date(System.currentTimeMillis()));
        applications.setConsultationType(ConsultationType.WAITING);
        applications.setTreatmentDone(false);
        applications.setPaymentDone(false);
        applications.setPatientGotApproved(true);
        applications.setMedicationPlusFollowUp(false);
        applications.setForCrossConsultation(false);

        temporaryAppointmentDataRepo.deleteById(temporaryAppointmentID);

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

                    notificationRepo.save(newNotification);

                    medicalUser.getNotifications().add(newNotification);

                    userRepo.save(medicalUser);

                });

        return patientID;

    }

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

    public List<Department> getDepartments() {

        return departmentRepo.findAll();

    }

    public List<Doctor> fetchDoctorsByDepartmentId(Long departmentId) throws DepartmentNotFoundException {

        Department fetchedDepartment = departmentRepo.findById(departmentId).orElseThrow(
                () -> new DepartmentNotFoundException("Department Not Found Exception")
        );

        return fetchedDepartment.getDoctor()
                .stream()
                .map(doctor -> {

                    Doctor doctor1 = new Doctor();

                    doctor1.setId(doctor.getId());
                    doctor1.setDoctorName(doctor.getDoctorName());

                    return doctor1;

                })
                .collect(Collectors.toList());

    }

    public Department getDepartmentById(Long departmentId) throws DepartmentNotFoundException {

        return departmentRepo.findById(departmentId).orElseThrow(
                () -> new DepartmentNotFoundException("Department Not Found")
        );

    }

    public List<ApplicationsResponseModel> getAllBookingsByNotCompletePaging(int pageNumber, int size) {

        List<Applications> fetchedApplicationsMain = applicationsRepo.findAll();

        List<ApplicationsResponseModel> fetchedApplications =  fetchedApplicationsMain
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

        int start = pageNumber * size;
        int end = Math.min(start + size, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    public List<MedicalSupportResponseModel> fetchPatientApprovals(int pageNumber, int size) {

        Pageable pageable = PageRequest.of(pageNumber, size);

        Page<Applications> applicationsPage = applicationsRepo.findAll(pageable);

        return applicationsPage
                .stream()
                .filter(application -> application.getConsultationType().equals(ConsultationType.PATIENTADMIT) && !application.isPatientGotApproved())
                .map(application1 -> {

                    MedicalSupportResponseModel applicationNew = new MedicalSupportResponseModel();

                    BeanUtils.copyProperties(application1, applicationNew);

                    User fetchedMedicalSupportUserDetails = application1.getMedicalSupportUser();

                    if ( fetchedMedicalSupportUserDetails != null ){

                        applicationNew.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
                        applicationNew.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

                    } else {

                        applicationNew.setMedicalSupportUserId(null);
                        applicationNew.setMedicalSupportUserName(null);

                    }

                    return applicationNew;

                })
                .collect(Collectors.toList());

    }

    public String deleteApplicationById(Long applicationId) {

        applicationsRepo.deleteById(applicationId);

        return "Application Deleted";

    }

    public String acceptApplicationById(
            Long applicationId,
            String patientAdmitMessage
    ) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setPatientGotApproved(true);
        fetchedApplication.setPatientAdmitMessage(patientAdmitMessage);

        applicationsRepo.save(fetchedApplication);

        User medicalSupportUser = fetchedApplication.getMedicalSupportUser();

        Notification notification = new Notification();

        notification.setMessage("Got Approval from Front Desk");
        notification.setTimeStamp(new Date(System.currentTimeMillis()));
        notification.setApplicationId(applicationId);
        notification.setRead(false);
        notification.setUser(medicalSupportUser);

        notificationRepo.save(notification);

        return "Approved";

    }

    public List<ApplicationsResponseModel> fetchMedicationPlusFollowUpPaging(int pageNumber, int size) {

        Pageable pageable = PageRequest.of(pageNumber, size);

        Page<Applications> applicationsPage = applicationsRepo.findAll(pageable);

        return applicationsPage
                .stream()
                .filter(applications -> applications.getConsultationType().equals(ConsultationType.COMPLETED) && applications.isMedicationPlusFollowUp() )
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

    public String acceptCrossConsultation(Long applicationId, String reasonForVisit, String doctorName) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setForCrossConsultation(false);
        fetchedApplication.setConsultationType(ConsultationType.WAITING);
        fetchedApplication.setMedicalSupportUser(null);
        fetchedApplication.setTreatmentDone(false);
        fetchedApplication.setApplicationCompletedTime(null);
        fetchedApplication.setPaymentDone(false);
        fetchedApplication.setPatientGotApproved(true);
        fetchedApplication.setMedicationPlusFollowUp(false);
        fetchedApplication.setAppointmentCreatedOn(new Date(System.currentTimeMillis()));

        applicationsRepo.save(fetchedApplication);

        userRepo.findAll()
                .stream()
                .filter(users -> users.getRole().equals(Role.MEDICALSUPPORT))
                .forEach(user -> {

                    Notification notification = new Notification();

                    notification.setMessage("New Application Booked");
                    notification.setTimeStamp(new Date(System.currentTimeMillis()));
                    notification.setApplicationId(applicationId);
                    notification.setRead(false);
                    notification.setUser(user);

                    notificationRepo.save(notification);

                });

        return "Accepted";

    }

    public List<TemporaryAppointmentDataEntity> fetchPatientOnBoardData(HttpServletRequest request) throws FrontDeskUserNotFoundException, RoleMismatchException {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedFrontDeskUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new FrontDeskUserNotFoundException("User Not Found")
        );

        if ( fetchedFrontDeskUser.getRole().equals(Role.FRONTDESK) ){

            return temporaryAppointmentDataRepo.findAll()
                    .stream()
                    .sorted(Comparator.comparing(TemporaryAppointmentDataEntity::getTimeStamp))
                    .limit(50)
                    .toList();

        }

        throw new RoleMismatchException("Role Mismatch");

    }

    public Boolean checkTheAppointmentIsAvailable(Long applicationID) throws TemporaryAppointmentNotFounException {

        TemporaryAppointmentDataEntity fetchedAppointment = temporaryAppointmentDataRepo.findById(applicationID).orElseThrow(
                () -> new TemporaryAppointmentNotFounException("Temporary Appointment Not Found")
        );

        return fetchedAppointment != null;

    }

}


