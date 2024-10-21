package com.Go_Work.Go_Work.Service.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.Appointments;
import com.Go_Work.Go_Work.Entity.Department;
import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Error.DepartmentNotFoundException;
import com.Go_Work.Go_Work.Repo.AppointmentsRepo;
import com.Go_Work.Go_Work.Repo.DepartmentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FrontDeskService {

    private final AppointmentsRepo appointmentsRepo;

    private final DepartmentRepo departmentRepo;

    public String bookAppointment(Appointments appointments) {

        // Set appointment details
        appointments.setAppointmentCreatedOn(new Date(System.currentTimeMillis()));
        appointments.setAppointmentFinished(false);

        // Save the appointment
        appointmentsRepo.save(appointments);

        return "Appointment Booked and Slot Created";
    }


    public List<Appointments> getAllBookingsByNotComplete() {

        return appointmentsRepo.findAll()
                .stream()
                .filter(appointment -> !appointment.isAppointmentFinished() )
                .collect(Collectors.toList());

    }

    public Appointments fetchAppointmentById(Long id) throws AppointmentNotFoundException {

        return appointmentsRepo.findById(id).orElseThrow(
                () -> new AppointmentNotFoundException("Id Not Found")
        );

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


