package com.Go_Work.Go_Work.Controller.TEST;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import com.Go_Work.Go_Work.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class TestController {

    private final ApplicationsRepo applicationsRepo;

    private final UserRepo userRepo;

    @GetMapping("/fetchApplicationsByMedicalSupportUserId/{medicalSupportUserId}/{pageNumber}/{size}")
    public ResponseEntity<List<Applications>> fetchApplicationsByMedicalSupportUserId(
            @PathVariable("medicalSupportUserId") Long medicalSupportUserId,
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("size") int size
    ){

        User fetchedUser = userRepo.findById(medicalSupportUserId).orElseThrow(
                () -> new RuntimeException("User Not Found Exception")
        );

        Pageable pageable = PageRequest.of(pageNumber, size);

        Page<Applications> fetchedApplications = applicationsRepo.findByMedicalSupportUser(fetchedUser, pageable);

        List<Applications> convertedList = fetchedApplications
                .stream()
                .toList();

        return ResponseEntity.ok(convertedList);

    }

    @GetMapping("/fetchApplicationById/{applicationId}")
    public ResponseEntity<Applications> fetchApplicationById(
            @PathVariable("applicationId") Long applicationId
    ){

        return ResponseEntity.ok(applicationsRepo.findById(applicationId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        ));

    }

    @GetMapping("/fetchAllApplications")
    public ResponseEntity<List<Applications>> fetchAllApplications(){

        return ResponseEntity.ok(applicationsRepo.findAll());

    }

}
