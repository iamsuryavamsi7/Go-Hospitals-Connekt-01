package com.Go_Work.Go_Work.Repo;

import com.Go_Work.Go_Work.Entity.Slots;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SlotsRepo extends JpaRepository<Slots, Long> {

    List<Slots> findByDate(LocalDate date);

}
