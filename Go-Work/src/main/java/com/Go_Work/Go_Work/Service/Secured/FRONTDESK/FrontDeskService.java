package com.Go_Work.Go_Work.Service.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.BillType;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.NotificationStatus;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Error.*;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.MedicalSupportResponseModel;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
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
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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

    private final NextAppointmentDateRepo nextAppointmentDateRepo ;

    public String fetchUserRole(HttpServletRequest request) throws FrontDeskUserNotFoundException {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        User fetchedFrontDeskUser = userRepo.findByEmail(userEmail).orElseThrow(
                () -> new FrontDeskUserNotFoundException("Front Desk User Not Found")
        );

        return fetchedFrontDeskUser.getRole().name();

    }

    @Transactional
    public String bookAppointment(Applications applications, Long temporaryAppointmentID) {

        // Set appointment details
        applications.setAppointmentCreatedOn(new Date(System.currentTimeMillis()));
        applications.setConsultationType(ConsultationType.WAITING);
        applications.setTreatmentDone(false);
        applications.setPaymentDone(false);
        applications.setPatientGotApproved(true);
        applications.setIsMedicationPlusFollow(false);

        // Create and associate the bill
        Bills bill = new Bills();
        bill.setBillNo(applications.getTempororyBillNo());
        bill.setTimeStamp(new Date(System.currentTimeMillis()));
        bill.setBillType(BillType.FRONTDESKBILL);
        bill.setApplications(applications);  // Automatically links the bill to the application

        // Add bill to the application (this is handled by CascadeType.ALL)
        applications.getBills().add(bill);

        // Delete temporary appointment
        temporaryAppointmentDataRepo.deleteById(temporaryAppointmentID);

        // Save the application (bills will be saved automatically)
        Applications savedApplication = applicationsRepo.save(applications);

        // Generate patient ID
        Long applicationId = savedApplication.getId();
        String formattedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("MMyy"));
        String patientID = formattedDate + applicationId;
        applications.setPatientId(patientID);

        // Save notifications for medical support users
        userRepo.findAll()
                .stream()
                .filter(user -> user.getRole().equals(Role.MEDICALSUPPORT))
                .forEach(medicalUser -> {
                    Notification newNotification = new Notification();
                    newNotification.setMessage("New Application Booked");
                    newNotification.setTimeStamp(new Date(System.currentTimeMillis()));
                    newNotification.setApplicationId(applicationId);
                    newNotification.setRead(false);
                    newNotification.setUser(medicalUser);
                    newNotification.setNotificationStatus(NotificationStatus.BOOKAPPOINTMENT);

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

        if ( !fetchedApplication.getBills().isEmpty() ){

            Bills latestBill = fetchedApplication.getBills()
                    .stream()
                    .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                    .findFirst()
                    .orElse(null);

            application1.setBillNo(latestBill.getBillNo());

            List<Bills> billsObject = fetchedApplication.getBills()
                    .stream()
                    .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                    .toList();

            application1.setBills(billsObject);

        }

        if ( !fetchedApplication.getPharmacyMessages().isEmpty() ){

            List<PharmacyMessage> pharmacyMessages = fetchedApplication.getPharmacyMessages()
                    .stream()
                    .sorted(Comparator.comparing(PharmacyMessage::getTimeStamp).reversed())
                    .toList();

            application1.setPharmacyMessages(pharmacyMessages);

        }

        if ( !fetchedApplication.getPrescriptionUrl().isEmpty() ){

            List<ImageUrls> imageUrls = fetchedApplication.getPrescriptionUrl()
                    .stream()
                    .sorted(Comparator.comparing(ImageUrls::getTimeStamp).reversed())
                    .toList();

            application1.setPrescriptionUrl(imageUrls);

        }

        if ( !fetchedApplication.getNextAppointmentDate().isEmpty() ){

            NextAppointmentDate fetchedLatest = fetchedApplication.getNextAppointmentDate()
                    .stream()
                    .sorted(Comparator.comparing(NextAppointmentDate::getNextFollowUpDate).reversed())
                    .findFirst()
                    .orElse(null);

            application1.setNextFollowUpDate(fetchedLatest.getNextFollowUpDate());

            application1.setNextAppointmentDate(fetchedApplication.getNextAppointmentDate());

        }

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

                    if ( !user01.getBills().isEmpty() ){

                        Bills latestBill = user01.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        user1.setBillNo(latestBill.getBillNo());

                    }

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

        List<Applications> fetchedApplicationsMain = applicationsRepo.findAll();

        List<ApplicationsResponseModel> fetchedApplications =  fetchedApplicationsMain
                .stream()
                .filter(appointment -> appointment.getConsultationType().equals(ConsultationType.FOLLOWUPCOMPLETED))
                .map(application1 -> {

                    ApplicationsResponseModel newApplication = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, newApplication);

                    if ( !application1.getBills().isEmpty() ){

                        Bills latestBill = application1.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        newApplication.setBillNo(latestBill.getBillNo());

                    }

                    if ( !application1.getNextAppointmentDate().isEmpty() ){

                        NextAppointmentDate latestAppointment = application1.getNextAppointmentDate()
                                .stream()
                                .sorted(Comparator.comparing(NextAppointmentDate::getNextFollowUpDate).reversed())
                                .findFirst()
                                .orElse(null);

                        newApplication.setNextFollowUpDate(latestAppointment.getNextFollowUpDate());

                    }

                    User fetchedMedicalSupportUserDetails = application1.getMedicalSupportUser();

                    if ( fetchedMedicalSupportUserDetails != null ){

                        newApplication.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
                        newApplication.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

                    } else {

                        newApplication.setMedicalSupportUserId(null);
                        newApplication.setMedicalSupportUserName(null);

                    }

                    return newApplication;

                })
                .toList();

        List<ApplicationsResponseModel> sortedList = fetchedApplications
                .stream()
//                .filter(appointment -> !appointment.getNextAppointmentDate().isEmpty() )
                .sorted(Comparator.comparing(ApplicationsResponseModel::getNextFollowUpDate))
                .toList();

        int start = pageNumber * size;
        int end = Math.min(start + size, sortedList.size());

        return sortedList.subList(start, end);

    }

    public String acceptCrossConsultation(Long applicationId, String reasonForVisit, String doctorName) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setConsultationType(ConsultationType.WAITING);
        fetchedApplication.setMedicalSupportUser(null);
        fetchedApplication.setTreatmentDone(false);
        fetchedApplication.setApplicationCompletedTime(null);
        fetchedApplication.setPaymentDone(false);
        fetchedApplication.setPatientGotApproved(true);
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

    public String setNotificationReadByNotificationId(Long id) throws NotificationNotFoundException {

        Notification fetchedNotification = notificationRepo.findById(id).orElseThrow(
                () -> new NotificationNotFoundException("Notification Not Found")
        );

        fetchedNotification.setRead(true);

        notificationRepo.save(fetchedNotification);

        return "Notification Read Updated Successfully";

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

    public List<ApplicationsResponseModel> getAllCrossConsultationDetails(int pageNumber, int size) {

        List<Applications> fetchedApplicationsMain = applicationsRepo.findAll();

        List<ApplicationsResponseModel> fetchedApplications =  fetchedApplicationsMain
                .stream()
                .filter(appointment -> appointment.getConsultationType().equals(ConsultationType.CROSSCONSULTATION))
                .sorted(Comparator.comparing(Applications::getAppointmentCreatedOn).reversed())
                .map(user01 -> {

                    ApplicationsResponseModel user1 = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(user01, user1);

                    if ( user01.getBills() != null && !user01.getBills().isEmpty() ){

                        Bills latestBill = user01.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        user1.setBillNo(latestBill.getBillNo());

                    }

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

    public Boolean checkTemporaryDataAvailableForNewPatientOnBoardPage() {

        List<TemporaryAppointmentDataEntity> fetchedList = temporaryAppointmentDataRepo.findAll();

        return !fetchedList.isEmpty();

    }

    public Boolean deleteTemporaryAppointmentById(Long appointmentID) {

        temporaryAppointmentDataRepo.deleteById(appointmentID);

        return true;

    }

    public Boolean checkCrossConsultationAvailableOrNot() {

        List<Applications> fetchedApplications = applicationsRepo.findAll()
                .stream()
                .filter(application -> application.getConsultationType().equals(ConsultationType.CROSSCONSULTATION))
                .toList();

        if ( !fetchedApplications.isEmpty() ){

            return true;

        }

        return false;

    }

    public Boolean checkFollowUpPatientAvailableOrNot() {

        List<Applications> fetchedApplications = applicationsRepo.findAll()
                .stream()
                .filter(application -> application.getConsultationType().equals(ConsultationType.FOLLOWUPCOMPLETED))
                .toList();

        if ( !fetchedApplications.isEmpty() ){

            return true;

        }

        return false;

    }

    public Boolean rescheduleAppointment(Long applicationID, String note, Date updateNextAppointmentDateValue) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationID).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        NextAppointmentDate nextAppointmentDate = new NextAppointmentDate();

        nextAppointmentDate.setNextFollowUpDate(updateNextAppointmentDateValue);
        nextAppointmentDate.setNote(note);
        nextAppointmentDate.setApplication(fetchedApplication);

        fetchedApplication.getNextAppointmentDate().add(nextAppointmentDate);

        applicationsRepo.save(fetchedApplication);

        return true;

    }

    public Boolean deleteNextAppointmentData(Long nextAppointmentID) {

        NextAppointmentDate fetchedAppointment = nextAppointmentDateRepo.findById(nextAppointmentID).orElseThrow(
                () -> new UsernameNotFoundException("Appointment Not Found")
        );

        Applications fetchedApplication = fetchedAppointment.getApplication();

        List<NextAppointmentDate> fetchedAppointments = fetchedApplication.getNextAppointmentDate();

        if ( fetchedAppointments.size() > 1 ){

            fetchedApplication.getNextAppointmentDate().removeIf(appointment -> appointment.getId().equals(nextAppointmentID));

            nextAppointmentDateRepo.deleteById(nextAppointmentID);

            return true;

        }

        return false;

    }

    @Transactional
    public Boolean forwardToNurse(Long applicationID, String billNo) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationID).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setConsultationType(ConsultationType.WAITING);
        fetchedApplication.setTreatmentDone(false);
        fetchedApplication.setPaymentDone(false);
        fetchedApplication.setPatientGotApproved(true);
        fetchedApplication.setIsMedicationPlusFollow(false);
        fetchedApplication.setMedicalSupportUser(null);

        if ( billNo != null && !billNo.isBlank() ){

            Bills newBillObject = new Bills();

            newBillObject.setBillType(BillType.FRONTDESKBILL);
            newBillObject.setBillNo(billNo);
            newBillObject.setApplications(fetchedApplication);
            newBillObject.setTimeStamp(new Date(System.currentTimeMillis()));

            fetchedApplication.getBills().add(newBillObject);

        }

        applicationsRepo.save(fetchedApplication);

        // Save notifications for medical support users
        userRepo.findAll()
                .stream()
                .filter(user -> user.getRole().equals(Role.MEDICALSUPPORT))
                .forEach(medicalUser -> {
                    Notification newNotification = new Notification();
                    newNotification.setMessage("New Patient Added");
                    newNotification.setTimeStamp(new Date(System.currentTimeMillis()));
                    newNotification.setApplicationId(fetchedApplication.getId());
                    newNotification.setRead(false);
                    newNotification.setUser(medicalUser);
                    newNotification.setNotificationStatus(NotificationStatus.BOOKAPPOINTMENT);

//                    notificationRepo.save(newNotification);

                    medicalUser.getNotifications().add(newNotification);

                    userRepo.save(medicalUser);

                });

        return true;

    }

    public List<ApplicationsResponseModel> fetchCaseClosedAppointmentsPaging(int pageNumber, int size) {

        List<Applications> fetchedApplicationsMain = applicationsRepo.findAll();

        List<ApplicationsResponseModel> fetchedApplications =  fetchedApplicationsMain
                .stream()
                .filter(appointment -> appointment.getConsultationType().equals(ConsultationType.CASECLOSED))
                .sorted(Comparator.comparing(Applications::getApplicationCompletedTime).reversed())
                .map(application1 -> {

                    ApplicationsResponseModel newApplication = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, newApplication);

                    if ( application1.getBills() != null && !application1.getBills().isEmpty() ){

                        Bills latestBill = application1.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        newApplication.setBillNo(latestBill.getBillNo());

                    }

                    User fetchedMedicalSupportUserDetails = application1.getMedicalSupportUser();

                    if ( fetchedMedicalSupportUserDetails != null ){

                        newApplication.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
                        newApplication.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

                    } else {

                        newApplication.setMedicalSupportUserId(null);
                        newApplication.setMedicalSupportUserName(null);

                    }

                    return newApplication;

                })
                .toList();

        int start = pageNumber * size;
        int end = Math.min(start + size, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    public List<ApplicationsResponseModel> fetchCompletedAppointments(int pageNumber, int size) {

        List<Applications> fetchedApplicationsMain = applicationsRepo.findAll();

        List<ApplicationsResponseModel> fetchedApplications =  fetchedApplicationsMain
                .stream()
                .filter(appointment -> appointment.getConsultationType().equals(ConsultationType.COMPLETED))
                .sorted(Comparator.comparing(Applications::getApplicationCompletedTime).reversed())
                .map(application1 -> {

                    ApplicationsResponseModel newApplication = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, newApplication);

                    if ( application1.getBills() != null && !application1.getBills().isEmpty() ){

                        Bills latestBill = application1.getBills()
                                .stream()
                                .sorted(Comparator.comparing(Bills::getTimeStamp).reversed())
                                .findFirst()
                                .orElse(null);

                        newApplication.setBillNo(latestBill.getBillNo());

                    }

                    User fetchedMedicalSupportUserDetails = application1.getMedicalSupportUser();

                    if ( fetchedMedicalSupportUserDetails != null ){

                        newApplication.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
                        newApplication.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

                    } else {

                        newApplication.setMedicalSupportUserId(null);
                        newApplication.setMedicalSupportUserName(null);

                    }

                    return newApplication;

                })
                .toList();

        int start = pageNumber * size;
        int end = Math.min(start + size, fetchedApplications.size());

        return fetchedApplications.subList(start, end);

    }

    public Boolean caseCloseById(Long applicationID, String caseCloseInput) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationID).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setConsultationType(ConsultationType.CASECLOSED);
        fetchedApplication.setPaymentDone(true);
        fetchedApplication.setApplicationCompletedTime(new Date(System.currentTimeMillis()));
        fetchedApplication.setPaymentDoneTime(new Date(System.currentTimeMillis()));

        if ( !caseCloseInput.isEmpty() ){

            fetchedApplication.setCaseCloseInput(caseCloseInput);

        }

        applicationsRepo.save(fetchedApplication);

        return true;

    }

}


