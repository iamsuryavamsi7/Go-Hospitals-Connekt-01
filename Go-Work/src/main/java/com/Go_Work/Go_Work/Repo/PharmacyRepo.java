package com.Go_Work.Go_Work.Repo;

import com.Go_Work.Go_Work.Entity.PharmacyMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PharmacyRepo extends JpaRepository<PharmacyMessage, Long> {
}
