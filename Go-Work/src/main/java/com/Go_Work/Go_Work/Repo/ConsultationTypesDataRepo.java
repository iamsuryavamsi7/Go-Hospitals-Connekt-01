package com.Go_Work.Go_Work.Repo;

import com.Go_Work.Go_Work.Entity.ConsultationTypesData;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;

public interface ConsultationTypesDataRepo extends JpaRepository<ConsultationTypesData, Long> {

    @Query("SELECT COUNT(c) FROM ConsultationTypesData c WHERE c.consultationType = :type AND c.timeStamp BETWEEN :startDate AND :endDate")
    long countByConsultationTypeAndDateRange(
            @Param("type") ConsultationType type,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Query("SELECT COUNT(c) FROM ConsultationTypesData c WHERE c.consultationType = :type AND c.timeStamp BETWEEN :startDate AND :endDate")
    long countByConsultationTypeForDate(ConsultationType type, Date startDate, Date endDate);

}
