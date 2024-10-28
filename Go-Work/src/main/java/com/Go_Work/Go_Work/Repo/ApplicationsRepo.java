package com.Go_Work.Go_Work.Repo;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationsRepo extends JpaRepository<Applications, Long> {

    Page<Applications> findByMedicalSupportUser(User medicalSupportUser, Pageable pageable);

}
