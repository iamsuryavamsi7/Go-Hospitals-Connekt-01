package com.Go_Work.Go_Work.Service.Secured.FRONTDESK;

import com.Go_Work.Go_Work.Entity.Appointments;
import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Repo.AppointmentsRepo;
import com.Go_Work.Go_Work.Repo.DoctorRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FrontDeskService {

    private final AppointmentsRepo appointmentsRepo;

    private final DoctorRepo doctorRepo;

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

}


