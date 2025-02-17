package com.Go_Work.Go_Work.Repo;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface ApplicationsRepo extends JpaRepository<Applications, Long> {

    Page<Applications> findByMedicalSupportUser(User medicalSupportUser, Pageable pageable);

    List<Applications> findByPatientIdOrNameContainingIgnoreCase(String patientID, String name);

    @Query("SELECT COUNT(a) FROM Applications a WHERE a.surgeryCompleted = true AND DATE(a.surgeryDate) = :selectedDate")
    long countByCompletedSurgeries(Date selectedDate);

    @Query("SELECT COUNT(a) FROM Applications a WHERE a.surgeryCompleted = true AND a.surgeryDate BETWEEN :startDate AND :endDate")
    long countByCompletedSurgeriesWithDateRange(Date startDate, Date endDate);

    @Query("SELECT COUNT(a) FROM Applications a WHERE a.appointmentCreatedOn BETWEEN :startDate AND :endDate")
    long countByApplicationBookedForSelectedDate(Date startDate, Date endDate);

}
