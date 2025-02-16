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
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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

    public MainAnalyticsAdminModel fetchMainAnalytics() {

        LocalDate todayDate = LocalDate.now();

        // code to find the count of patient admits
        long patientAdmitsCount = consultationTypesDataRepo.findAll().stream()
                .filter(consultationTypesData -> {

                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.PATIENTADMIT);

                })
                .count();

        // code to find the count of follow up completed
        long followUpPatientsCount = consultationTypesDataRepo.findAll().stream()
                .filter(consultationTypesData -> {

                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.FOLLOWUPCOMPLETED);

                })
                .count();

        // code to find the count of cross consultations
        long crossConsultationsCount = consultationTypesDataRepo.findAll().stream()
                .filter(consultationTypesData -> {

                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.CROSSCONSULTATION);

                })
                .count();

        // code to find the count of completed surgeries
        long completedSurgeriesCount = consultationTypesDataRepo.findAll().stream()
                .filter(consultationTypesData -> {

                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    Applications fetchedApplication = consultationTypesData.getApplications();

                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.SURGERYCARE) && fetchedApplication.getSurgeryCompleted().equals(true);

                })
                .count();

        // code to find the count of completed surgeries
        long closedCasesCount = consultationTypesDataRepo.findAll().stream()
                .filter(consultationTypesData -> {

                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.CASECLOSED);

                })
                .count();

        // code to find the count of completed surgeries
        long patientDropOutCount = consultationTypesDataRepo.findAll().stream()
                .filter(consultationTypesData -> {

                    LocalDate localDate = consultationTypesData.getTimeStamp().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    return localDate.equals(todayDate) && consultationTypesData.getConsultationType().equals(ConsultationType.PATIENTDROPOUT);

                })
                .count();

        long opsCount = applicationsRepo.findAll().stream()
                .filter(application -> {

                    LocalDate localDate = application.getAppointmentCreatedOn().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    return localDate.equals(todayDate);

                })
                .count();

        return MainAnalyticsAdminModel.builder()
                .opsCount(opsCount)
                .patientDropOutCount(patientDropOutCount)
                .closedCasesCount(closedCasesCount)
                .surgeriesCompletedCount(completedSurgeriesCount)
                .crossConsultationCount(crossConsultationsCount)
                .followUpPatientsCount(followUpPatientsCount)
                .patientAdmitsCount(patientAdmitsCount)
                .build();

    }

}
