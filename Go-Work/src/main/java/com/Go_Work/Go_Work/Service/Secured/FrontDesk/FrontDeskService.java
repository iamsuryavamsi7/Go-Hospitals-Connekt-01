package com.Go_Work.Go_Work.Service.Secured.FrontDesk;

import com.Go_Work.Go_Work.Entity.Slots;
import com.Go_Work.Go_Work.Repo.SlotsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FrontDeskService {

    private final SlotsRepo slotsRepo;

    public List<Slots> getAvailableSlots(LocalDate date) {

        return slotsRepo.findByDate(date)
                .stream()
                .filter(slot -> !slot.isBooked() )
                .collect(Collectors.toList());

    }

    public List<Slots> getBookedSlotsByDate(LocalDate date) {
        return slotsRepo.findByDate(date);
    }

    public String addBookedSlots(Slots slots) {

        slots.setBooked(true);

        slotsRepo.save(slots);

        return "Slot Added";

    }

}
