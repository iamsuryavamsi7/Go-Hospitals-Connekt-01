package com.Go_Work.Go_Work.Service.Secured.ADMIN;

import com.Go_Work.Go_Work.Entity.Department;
import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Error.DepartmentNotFoundException;
import com.Go_Work.Go_Work.Error.DoctorNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.AddDoctorModel;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.DepartmentPutModel;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.GetDoctorModel;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.UpdateDoctorModel;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Repo.DepartmentRepo;
import com.Go_Work.Go_Work.Repo.DoctorRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import com.Go_Work.Go_Work.Service.Email.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepo userRepo;

    private final DoctorRepo doctorRepo;

    private final DepartmentRepo departmentRepo;

    private final EmailSenderService emailSenderService;

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

            sendRegistrationEmail(user.getEmail());

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

}
