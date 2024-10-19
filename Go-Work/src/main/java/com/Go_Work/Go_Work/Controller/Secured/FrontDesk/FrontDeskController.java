package com.Go_Work.Go_Work.Controller.Secured.FrontDesk;

import com.Go_Work.Go_Work.Entity.Slots;
import com.Go_Work.Go_Work.Service.Secured.FrontDesk.FrontDeskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/frontDesk")
@RequiredArgsConstructor
public class FrontDeskController {

    private final FrontDeskService frontDeskService;

    @GetMapping("/fetchAllAvailableSlots/{date}")
    public ResponseEntity<List<Slots>> getAvailableSlots(
            @PathVariable("date") String date
    ){

        LocalDate appointmentDate = LocalDate.parse(date);

        List<Slots> fetchedSlots = frontDeskService.getAvailableSlots(appointmentDate);

        return ResponseEntity.ok(fetchedSlots);

    }

    @GetMapping("/fetchBookedSlots/{date}")
    public ResponseEntity<List<Slots>> fetchBookedSlots(@PathVariable("date") String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<Slots> bookedSlots = frontDeskService.getBookedSlotsByDate(localDate);
        return ResponseEntity.ok(bookedSlots);
    }

    @PostMapping("/addBookedSlots")
    public ResponseEntity<String> addBookedSlots(
            @RequestBody Slots slots
    ){

        String message = frontDeskService.addBookedSlots(slots);

        return ResponseEntity.ok(message);

    }

}
