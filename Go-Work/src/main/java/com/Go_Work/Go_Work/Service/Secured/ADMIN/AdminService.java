package com.Go_Work.Go_Work.Service.Secured.ADMIN;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.*;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Error.DepartmentNotFoundException;
import com.Go_Work.Go_Work.Error.DoctorNotFoundException;
import com.Go_Work.Go_Work.Error.MobileNumberNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Repo.*;
import com.Go_Work.Go_Work.Service.Email.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final MobileNumbersRepo mobileNumbersRepo;

    private final UserRepo userRepo;

    private final DoctorRepo doctorRepo;

    private final DepartmentRepo departmentRepo;

    private final EmailSenderService emailSenderService;

    private final BCryptPasswordEncoder passwordEncoder;

    private final ConsultationTypesDataRepo consultationTypesDataRepo;

    private final ApplicationsRepo applicationsRepo;

    public List<UserObject> fetchLockedUsers() {

        return userRepo.findAll()
                .stream()
                .filter(user -> !user.isUnLocked() || !user.isAccountNonLocked() )
                .map(fetchedUser -> {

                    UserObject fetchedUser1 = new UserObject();

                    BeanUtils.copyProperties(fetchedUser, fetchedUser1);

                    return fetchedUser1;

                })
                .collect(Collectors.toList());

    }

    @Async
    private void sendRegistrationEmail(String email) {
        emailSenderService.sendSimpleEmail(
                email,
                "\n\nYour registration is been updated. Please wait for approval from your admin\n\n",
                "Registration Approved"
        );
    }

    public String acceptUserById(Long userId) {

        Optional<User> fetchedUser = userRepo.findById(userId);

        if ( fetchedUser.isPresent() ){

            User user = fetchedUser.get();

            user.setUnLocked(true);

            userRepo.save(user);

            sendRegistrationEmail(user.getUsername());

            return "User Accepted";

        }

        throw new UsernameNotFoundException("User Not Found");

    }

    public String deleteUserById(Long userId) {

        userRepo.deleteById(userId);

        return "User Deleted";

    }

    public String addDoctor(AddDoctorModel doctor) {

        Doctor newDoctor = new Doctor();

        newDoctor.setDoctorName(doctor.getDoctorName());

        doctorRepo.save(newDoctor);

        return "User Saved";

    }

    public String deleteDoctor(Long doctorId) {

        doctorRepo.deleteById(doctorId);

        return "Doctor Deleted";

    }

    // Departments Control
    public List<Department> getDepartments() {

        return departmentRepo.findAll();

    }

    public String addDepartment(String departmentName) {

        Department newDepartment = new Department();

        newDepartment.setDepartmentName(departmentName);

        departmentRepo.save(newDepartment);

        return "Department Saved";

    }

    public String deleteDepartmentById(Long id) {

        departmentRepo.deleteById(id);

        return "Department Saved";

    }

    public Department fetchDepartmentDataById(Long departmentId) throws DepartmentNotFoundException {

        return departmentRepo.findById(departmentId).orElseThrow(
                () -> new DepartmentNotFoundException("Department Not Found")
        );

    }

    public String editDepartmentById(Long departmentId, DepartmentPutModel request) throws DepartmentNotFoundException {

        Department department = departmentRepo.findById(departmentId).orElseThrow(
                () -> new DepartmentNotFoundException("Department Not Found Exception")
        );

        department.setDepartmentName(request.getDepartmentName());

        departmentRepo.save(department);

        return "Department Changed";

    }

    public List<GetDoctorModel> getDoctors() {

        return doctorRepo.findAll()
                .stream()
                .map(doctor -> {

                    GetDoctorModel newDoctorModel = new GetDoctorModel();

                    Department newDepartment = doctor.getDepartment();

                    newDoctorModel.setId(doctor.getId());
                    newDoctorModel.setDoctorName(doctor.getDoctorName());

                    if ( newDepartment != null && newDepartment.getDepartmentName() != null) {

                        newDoctorModel.setDoctorDepartment(newDepartment.getDepartmentName());

                    } else {

                        newDoctorModel.setDoctorDepartment("No Data");

                    }

                    return newDoctorModel;

                })
                .collect(Collectors.toList());

    }

    public String updateDoctorById(Long doctorId, Long departmentId, UpdateDoctorModel updateDoctorModel) throws DoctorNotFoundException, DepartmentNotFoundException {

        Doctor fetchedDoctor = doctorRepo.findById(doctorId).orElseThrow(
                () -> new DoctorNotFoundException("Doctor Not Found")
        );

        fetchedDoctor.setDoctorName(updateDoctorModel.getDoctorName());

        Department fetchedDepartment = departmentRepo.findById(departmentId).orElseThrow(
                () -> new DepartmentNotFoundException("Department Not Found")
        );

        fetchedDepartment.getDoctor().add(fetchedDoctor);

        departmentRepo.save(fetchedDepartment);

        fetchedDoctor.setDepartment(fetchedDepartment);

        doctorRepo.save(fetchedDoctor);

        return "Doctor Saved";

    }

    public Doctor getDoctorById(Long doctorId) throws DoctorNotFoundException {

        return doctorRepo.findById(doctorId).orElseThrow(
                () -> new DoctorNotFoundException("Doctor Not Found")
        );

    }

    public List<MobileNumbers> fetchNumbers() {

        return mobileNumbersRepo.findAll()
                .stream()
                .sorted(Comparator.comparing(MobileNumbers::getCreatedTimeStamp).reversed())
                .toList();

    }

    public Boolean addMobileNumber(String name, String mobileNumber) {

        if ( name != null && !name.isBlank() && mobileNumber != null && !mobileNumber.isBlank() ){

            MobileNumbers mobileNumberObject = new MobileNumbers();

            mobileNumberObject.setName(name);
            mobileNumberObject.setMobileNumber(mobileNumber);
            mobileNumberObject.setCreatedTimeStamp(new Date(System.currentTimeMillis()));

            mobileNumbersRepo.save(mobileNumberObject);

            return true;

        }

        return false;

    }

    public Boolean deleteMobileNumberById(Long mobileNumberID) {

        mobileNumbersRepo.deleteById(mobileNumberID);

        return true;

    }

    public MobileNumbers fetchMobileNumberById(Long mobileNumberID) throws MobileNumberNotFoundException {

        return mobileNumbersRepo.findById(mobileNumberID).orElseThrow(
                () -> new MobileNumberNotFoundException("Mobile Number Not Found")
        );

    }

    public Boolean editMobileNumberById(Long mobileNumberID, String name, String mobileNumber) throws MobileNumberNotFoundException {

        MobileNumbers fetchedMobileNumberObject = mobileNumbersRepo.findById(mobileNumberID).orElseThrow(
                () -> new MobileNumberNotFoundException("Mobile Number Not Found")
        );

        if ( fetchedMobileNumberObject != null && !name.isBlank() && !mobileNumber.isBlank() ){

            fetchedMobileNumberObject.setName(name);
            fetchedMobileNumberObject.setMobileNumber(mobileNumber);

            mobileNumbersRepo.save(fetchedMobileNumberObject);

            return true;

        }

        return false;

    }

    public List<UsersDataAdminModel> fetchUsersData() {

        return userRepo.findAll()
                .stream()
                .filter(user -> !user.getRole().equals(Role.ADMIN) )
                .sorted(Comparator.comparing(User::getRegisteredOn).reversed())
                .map(user -> {

                    UsersDataAdminModel userData = new UsersDataAdminModel();

                    userData.setId(user.getId());
                    userData.setUsername(user.getUsername());
                    userData.setRole(user.getRole());

                    return userData;

                })
                .toList();

    }

    public Boolean deleteUserByIdPermanent(Long userId) {

        userRepo.deleteById(userId);

        return true;

    }

    public Boolean addUserName(String username, String password, Role role) {

        User newUser = new User();

        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role);
        newUser.setUnLocked(true);
        newUser.setRegisteredOn(new Date(System.currentTimeMillis()));

        userRepo.save(newUser);

        return true;

    }

    public UsersDataAdminModel fetchUserDataById(Long userId) {

        User fetchedUser = userRepo.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found Exception")
        );

        UsersDataAdminModel newDataModel = new UsersDataAdminModel();

        newDataModel.setId(fetchedUser.getId());
        newDataModel.setUsername(fetchedUser.getUsername());
        newDataModel.setRole(fetchedUser.getRole());

        return newDataModel;

    }

    public Boolean editUserDataById(Long userId, String username, String password, Role role) {

        User fetchedUser = userRepo.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found Exception")
        );

        if ( username != null && !username.isBlank() ) {

            fetchedUser.setUsername(username);

        }

        if ( password != null && !password.isBlank() ) {

            fetchedUser.setPassword(passwordEncoder.encode(password));

        }

        if ( role != null ) {

            fetchedUser.setRole(role);

        }

        userRepo.save(fetchedUser);

        return true;

    }

    @Transactional
    public MainAnalyticsAdminModel fetchMainAnalytics() {

        Date todayDate = new Date();

        Calendar calendarStartTime = Calendar.getInstance();

        calendarStartTime.setTime(todayDate);
        calendarStartTime.set(Calendar.HOUR_OF_DAY, 0);
        calendarStartTime.set(Calendar.MINUTE, 0);
        calendarStartTime.set(Calendar.SECOND, 0);
        calendarStartTime.set(Calendar.MILLISECOND, 0);

        Date startOfDate = calendarStartTime.getTime();

        Calendar calendarEndTime = Calendar.getInstance();

        calendarStartTime.setTime(todayDate);
        calendarStartTime.set(Calendar.HOUR_OF_DAY, 23);
        calendarStartTime.set(Calendar.MINUTE, 59);
        calendarStartTime.set(Calendar.SECOND, 59);
        calendarStartTime.set(Calendar.MILLISECOND, 999);

        Date endOfDate = calendarEndTime.getTime();

        // code to find the count of patient admits today
//        long patientAdmitsCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.PATIENTADMIT);
//
//                })
//                .count();

        long patientAdmitsCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.PATIENTADMIT, startOfDate, endOfDate);

        // code to find the count of follow up completed today
//        long followUpPatientsCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.FOLLOWUPCOMPLETED);
//
//                })
//                .count();

        long followUpPatientsCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.FOLLOWUPCOMPLETED, startOfDate, endOfDate);

        // code to find the count of cross consultations today
//        long crossConsultationsCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.CROSSCONSULTATION);
//
//                })
//                .count();

        long crossConsultationsCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.CROSSCONSULTATION, startOfDate, endOfDate);

        // code to find the count of completed surgeries today
//        long completedSurgeriesCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    Applications fetchedApplication = consultationTypesData.getApplications();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.SURGERYCARE) && fetchedApplication.getSurgeryCompleted().equals(true);
//
//                })
//                .count();

        long completedSurgeriesCount = applicationsRepo.countByCompletedSurgeries(todayDate);

        // code to find the count of closed cases today
//        long closedCasesCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.CASECLOSED);
//
//                })
//                .count();

        long closedCasesCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.CASECLOSED, startOfDate, endOfDate);

        // code to find the count of patient dropouts today
//        long patientDropOutCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.PATIENTDROPOUT);
//
//                })
//                .count();

        long patientDropOutCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.PATIENTDROPOUT, startOfDate, endOfDate);

        // code to find the count of onsite review patient dressing today
//        long onSiteReviewPatientDressingCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.ONSITREVIEWPATIENTDRESSING);
//
//                })
//                .count();

        long onSiteReviewPatientDressingCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.ONSITREVIEWPATIENTDRESSING, startOfDate, endOfDate);

        // code to find the count of onsite vascular injections today
//        long onSiteVascularInjectionsCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.ONSITEVASCULARINJECTIONS);
//
//                })
//                .count();

        long onSiteVascularInjectionsCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.ONSITEVASCULARINJECTIONS, startOfDate, endOfDate);

        // code to find the count of onsite vascular injections today
//        long onSiteQuickTreatmentCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.ONSITEQUICKTREATMENT);
//
//                })
//                .count();

        long onSiteQuickTreatmentCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.ONSITEQUICKTREATMENT, startOfDate, endOfDate);

        // code to find the count of onsite vascular injections today
//        long onSiteCasualityPatientsCount = consultationTypesDataRepo.findAll().stream()
//                .filter(consultationTypesData -> {
//
//                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.ONSITECASCUALITYPATIENT);
//
//                })
//                .count();

        long onSiteCasualityPatientsCount = consultationTypesDataRepo.countByConsultationTypeForDate(ConsultationType.ONSITECASCUALITYPATIENT, startOfDate, endOfDate);

        // code to find the count of ops booked today
//        long opsCount = applicationsRepo.findAll().stream()
//                .filter(application -> {
//
//                    LocalDate localDate = application.getAppointmentCreatedOn().toInstant()
//                            .atZone(ZoneId.systemDefault())
//                            .toLocalDate();
//
//                    return localDate.equals(todayDate);
//
//                })
//                .count();

        long opsCount = applicationsRepo.countByApplicationBookedForSelectedDate(startOfDate, endOfDate);

        return MainAnalyticsAdminModel.builder()
                .opsCount(opsCount)
                .onSiteReviewPatientDressingCount(onSiteReviewPatientDressingCount)
                .onSiteVascularInjectionsCount(onSiteVascularInjectionsCount)
                .onSiteQuickTreatmentCount(onSiteQuickTreatmentCount)
                .onSiteCasualityPatientsCount(onSiteCasualityPatientsCount)
                .patientDropOutCount(patientDropOutCount)
                .closedCasesCount(closedCasesCount)
                .surgeriesCompletedCount(completedSurgeriesCount)
                .crossConsultationCount(crossConsultationsCount)
                .followUpPatientsCount(followUpPatientsCount)
                .patientAdmitsCount(patientAdmitsCount)
                .build();

    }

    @Transactional
    public MainAnalyticsAdminModel fetchOneWeekAnalytics() {

        Date oneWeekBeforeDate = Date.from(LocalDate.now().minusWeeks(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        Date todayDate = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());

        Calendar endOfToday = Calendar.getInstance();

        endOfToday.setTime(todayDate);
        endOfToday.set(Calendar.HOUR_OF_DAY, 23);
        endOfToday.set(Calendar.MINUTE, 59);
        endOfToday.set(Calendar.SECOND, 59);
        endOfToday.set(Calendar.MILLISECOND, 999);

        Date endOfTodayWithTime = endOfToday.getTime();

        long opsCount = applicationsRepo.countByApplicationBookedForSelectedDate(oneWeekBeforeDate, endOfTodayWithTime);

        long patientAdmitsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTADMIT,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        long onSiteReviewPatientDressingsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITREVIEWPATIENTDRESSING,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        long onSiteVascularInjectionsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        long onSiteQuickTreatmentCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        long onSiteCasualityPatientCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITECASCUALITYPATIENT,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        long followUpCompletedCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.FOLLOWUPCOMPLETED,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        long crossConsultationCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CROSSCONSULTATION,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        long completedSurgeriesCount = applicationsRepo.countByCompletedSurgeriesWithDateRange(oneWeekBeforeDate, endOfTodayWithTime);

        long closedCasesCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CASECLOSED,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        long patientDropOutCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTDROPOUT,
                oneWeekBeforeDate,
                endOfTodayWithTime
        );

        return MainAnalyticsAdminModel.builder()
                .opsCount(opsCount)
                .onSiteReviewPatientDressingCount(onSiteReviewPatientDressingsCount)
                .onSiteVascularInjectionsCount(onSiteVascularInjectionsCount)
                .onSiteCasualityPatientsCount(onSiteQuickTreatmentCount)
                .onSiteCasualityPatientsCount(onSiteCasualityPatientCount)
                .patientAdmitsCount(patientAdmitsCount)
                .followUpPatientsCount(followUpCompletedCount)
                .crossConsultationCount(crossConsultationCount)
                .surgeriesCompletedCount(completedSurgeriesCount)
                .closedCasesCount(closedCasesCount)
                .patientDropOutCount(patientDropOutCount)
                .build();

    }

    @Transactional
    public MainAnalyticsAdminModel fetchOneMonthAnalytics() {

        Date oneMonthBeforeDate = Date.from(LocalDate.now().minusMonths(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        Date todayDate = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());

        Calendar endOfToday = Calendar.getInstance();

        endOfToday.setTime(todayDate);
        endOfToday.set(Calendar.HOUR_OF_DAY, 23);
        endOfToday.set(Calendar.MINUTE, 59);
        endOfToday.set(Calendar.SECOND, 59);
        endOfToday.set(Calendar.MILLISECOND, 999);

        Date endOfTodayWithTime = endOfToday.getTime();

        long opsCount = applicationsRepo.countByApplicationBookedForSelectedDate(oneMonthBeforeDate, endOfTodayWithTime);

        long patientAdmitsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTADMIT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteReviewPatientDressingsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITREVIEWPATIENTDRESSING,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteVascularInjectionsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteQuickTreatmentCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteCasualityPatientCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITECASCUALITYPATIENT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long followUpCompletedCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.FOLLOWUPCOMPLETED,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long crossConsultationCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CROSSCONSULTATION,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long completedSurgeriesCount = applicationsRepo.countByCompletedSurgeriesWithDateRange(oneMonthBeforeDate, todayDate);

        long closedCasesCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CASECLOSED,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long patientDropOutCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTDROPOUT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        return MainAnalyticsAdminModel.builder()
                .opsCount(opsCount)
                .onSiteReviewPatientDressingCount(onSiteReviewPatientDressingsCount)
                .onSiteVascularInjectionsCount(onSiteVascularInjectionsCount)
                .onSiteCasualityPatientsCount(onSiteQuickTreatmentCount)
                .onSiteCasualityPatientsCount(onSiteCasualityPatientCount)
                .patientAdmitsCount(patientAdmitsCount)
                .followUpPatientsCount(followUpCompletedCount)
                .crossConsultationCount(crossConsultationCount)
                .surgeriesCompletedCount(completedSurgeriesCount)
                .closedCasesCount(closedCasesCount)
                .patientDropOutCount(patientDropOutCount)
                .build();

    }

    @Transactional
    public MainAnalyticsAdminModel fetchThreeMonthsAnalytics() {

        Date oneMonthBeforeDate = Date.from(LocalDate.now().minusMonths(3).atStartOfDay(ZoneId.systemDefault()).toInstant());

        Date todayDate = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());

        Calendar endOfToday = Calendar.getInstance();

        endOfToday.setTime(todayDate);
        endOfToday.set(Calendar.HOUR_OF_DAY, 23);
        endOfToday.set(Calendar.MINUTE, 59);
        endOfToday.set(Calendar.SECOND, 59);
        endOfToday.set(Calendar.MILLISECOND, 999);

        Date endOfTodayWithTime = endOfToday.getTime();

        long opsCount = applicationsRepo.countByApplicationBookedForSelectedDate(oneMonthBeforeDate, endOfTodayWithTime);

        long patientAdmitsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTADMIT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteReviewPatientDressingsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITREVIEWPATIENTDRESSING,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteVascularInjectionsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteQuickTreatmentCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteCasualityPatientCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITECASCUALITYPATIENT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long followUpCompletedCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.FOLLOWUPCOMPLETED,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long crossConsultationCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CROSSCONSULTATION,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long completedSurgeriesCount = applicationsRepo.countByCompletedSurgeriesWithDateRange(oneMonthBeforeDate, todayDate);

        long closedCasesCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CASECLOSED,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long patientDropOutCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTDROPOUT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        return MainAnalyticsAdminModel.builder()
                .opsCount(opsCount)
                .onSiteReviewPatientDressingCount(onSiteReviewPatientDressingsCount)
                .onSiteVascularInjectionsCount(onSiteVascularInjectionsCount)
                .onSiteCasualityPatientsCount(onSiteQuickTreatmentCount)
                .onSiteCasualityPatientsCount(onSiteCasualityPatientCount)
                .patientAdmitsCount(patientAdmitsCount)
                .followUpPatientsCount(followUpCompletedCount)
                .crossConsultationCount(crossConsultationCount)
                .surgeriesCompletedCount(completedSurgeriesCount)
                .closedCasesCount(closedCasesCount)
                .patientDropOutCount(patientDropOutCount)
                .build();

    }

    @Transactional
    public MainAnalyticsAdminModel fetchSixMonthsAnalytics() {

        Date oneMonthBeforeDate = Date.from(LocalDate.now().minusMonths(6).atStartOfDay(ZoneId.systemDefault()).toInstant());

        Date todayDate = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());

        Calendar endOfToday = Calendar.getInstance();

        endOfToday.setTime(todayDate);
        endOfToday.set(Calendar.HOUR_OF_DAY, 23);
        endOfToday.set(Calendar.MINUTE, 59);
        endOfToday.set(Calendar.SECOND, 59);
        endOfToday.set(Calendar.MILLISECOND, 999);

        Date endOfTodayWithTime = endOfToday.getTime();

        long opsCount = applicationsRepo.countByApplicationBookedForSelectedDate(oneMonthBeforeDate, endOfTodayWithTime);

        long patientAdmitsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTADMIT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteReviewPatientDressingsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITREVIEWPATIENTDRESSING,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteVascularInjectionsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteQuickTreatmentCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteCasualityPatientCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITECASCUALITYPATIENT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long followUpCompletedCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.FOLLOWUPCOMPLETED,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long crossConsultationCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CROSSCONSULTATION,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long completedSurgeriesCount = applicationsRepo.countByCompletedSurgeriesWithDateRange(oneMonthBeforeDate, todayDate);

        long closedCasesCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CASECLOSED,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long patientDropOutCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTDROPOUT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        return MainAnalyticsAdminModel.builder()
                .opsCount(opsCount)
                .onSiteReviewPatientDressingCount(onSiteReviewPatientDressingsCount)
                .onSiteVascularInjectionsCount(onSiteVascularInjectionsCount)
                .onSiteCasualityPatientsCount(onSiteQuickTreatmentCount)
                .onSiteCasualityPatientsCount(onSiteCasualityPatientCount)
                .patientAdmitsCount(patientAdmitsCount)
                .followUpPatientsCount(followUpCompletedCount)
                .crossConsultationCount(crossConsultationCount)
                .surgeriesCompletedCount(completedSurgeriesCount)
                .closedCasesCount(closedCasesCount)
                .patientDropOutCount(patientDropOutCount)
                .build();

    }

    @Transactional
    public MainAnalyticsAdminModel fetchOneYearAnalytics() {

        Date oneMonthBeforeDate = Date.from(LocalDate.now().minusYears(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        Date todayDate = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());

        Calendar endOfToday = Calendar.getInstance();

        endOfToday.setTime(todayDate);
        endOfToday.set(Calendar.HOUR_OF_DAY, 23);
        endOfToday.set(Calendar.MINUTE, 59);
        endOfToday.set(Calendar.SECOND, 59);
        endOfToday.set(Calendar.MILLISECOND, 999);

        Date endOfTodayWithTime = endOfToday.getTime();

        long opsCount = applicationsRepo.countByApplicationBookedForSelectedDate(oneMonthBeforeDate, endOfTodayWithTime);

        long patientAdmitsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTADMIT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteReviewPatientDressingsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITREVIEWPATIENTDRESSING,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteVascularInjectionsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteQuickTreatmentCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long onSiteCasualityPatientCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITECASCUALITYPATIENT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long followUpCompletedCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.FOLLOWUPCOMPLETED,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long crossConsultationCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CROSSCONSULTATION,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long completedSurgeriesCount = applicationsRepo.countByCompletedSurgeriesWithDateRange(oneMonthBeforeDate, todayDate);

        long closedCasesCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CASECLOSED,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        long patientDropOutCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTDROPOUT,
                oneMonthBeforeDate,
                endOfTodayWithTime
        );

        return MainAnalyticsAdminModel.builder()
                .opsCount(opsCount)
                .onSiteReviewPatientDressingCount(onSiteReviewPatientDressingsCount)
                .onSiteVascularInjectionsCount(onSiteVascularInjectionsCount)
                .onSiteCasualityPatientsCount(onSiteQuickTreatmentCount)
                .onSiteCasualityPatientsCount(onSiteCasualityPatientCount)
                .patientAdmitsCount(patientAdmitsCount)
                .followUpPatientsCount(followUpCompletedCount)
                .crossConsultationCount(crossConsultationCount)
                .surgeriesCompletedCount(completedSurgeriesCount)
                .closedCasesCount(closedCasesCount)
                .patientDropOutCount(patientDropOutCount)
                .build();

    }

    @Transactional
    public MainAnalyticsAdminModel fetchAnalyticsByDates(Date startDate, Date endDate) {

        Calendar endOfDate = Calendar.getInstance();

        endOfDate.setTime(endDate);
        endOfDate.set(Calendar.HOUR_OF_DAY, 23);
        endOfDate.set(Calendar.MINUTE, 59);
        endOfDate.set(Calendar.SECOND, 59);
        endOfDate.set(Calendar.MILLISECOND, 999);

        Date endOfDateWithTime = endOfDate.getTime();

        long opsCount = applicationsRepo.countByApplicationBookedForSelectedDate(startDate, endOfDateWithTime);

        long patientAdmitsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTADMIT,
                startDate,
                endOfDateWithTime
        );

        long onSiteReviewPatientDressingsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITREVIEWPATIENTDRESSING,
                startDate,
                endOfDateWithTime
        );

        long onSiteVascularInjectionsCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                startDate,
                endOfDateWithTime
        );

        long onSiteQuickTreatmentCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITEVASCULARINJECTIONS,
                startDate,
                endOfDateWithTime
        );

        long onSiteCasualityPatientCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.ONSITECASCUALITYPATIENT,
                startDate,
                endOfDateWithTime
        );

        long followUpCompletedCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.FOLLOWUPCOMPLETED,
                startDate,
                endOfDateWithTime
        );

        long crossConsultationCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CROSSCONSULTATION,
                startDate,
                endOfDateWithTime
        );

        long completedSurgeriesCount = applicationsRepo.countByCompletedSurgeriesWithDateRange(startDate, endOfDateWithTime);

        long closedCasesCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.CASECLOSED,
                startDate,
                endOfDateWithTime
        );

        long patientDropOutCount = consultationTypesDataRepo.countByConsultationTypeAndDateRange(
                ConsultationType.PATIENTDROPOUT,
                startDate,
                endOfDateWithTime
        );

        return MainAnalyticsAdminModel.builder()
                .opsCount(opsCount)
                .onSiteReviewPatientDressingCount(onSiteReviewPatientDressingsCount)
                .onSiteVascularInjectionsCount(onSiteVascularInjectionsCount)
                .onSiteCasualityPatientsCount(onSiteQuickTreatmentCount)
                .onSiteCasualityPatientsCount(onSiteCasualityPatientCount)
                .patientAdmitsCount(patientAdmitsCount)
                .followUpPatientsCount(followUpCompletedCount)
                .crossConsultationCount(crossConsultationCount)
                .surgeriesCompletedCount(completedSurgeriesCount)
                .closedCasesCount(closedCasesCount)
                .patientDropOutCount(patientDropOutCount)
                .build();

    }

}
