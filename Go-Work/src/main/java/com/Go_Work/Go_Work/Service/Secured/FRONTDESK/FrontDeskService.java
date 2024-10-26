package com.Go_Work.Go_Work.Service.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.*;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.DepartmentNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.DepartmentRepo;
import com.Go_Work.Go_Work.Repo.NotificationRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

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

    public String bookAppointment(Applications applications) {

        // Set appointment details
        applications.setAppointmentCreatedOn(new Date(System.currentTimeMillis()));
        applications.setConsultationType(ConsultationType.WAITING);
        applications.setTreatmentDone(false);
        applications.setPaymentDone(false);

        // Save the appointment
        Applications savedApplication = applicationsRepo.save(applications);

        Long applicationId = savedApplication.getId();

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

        return "Appointment Booked and Slot Created";

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

}


