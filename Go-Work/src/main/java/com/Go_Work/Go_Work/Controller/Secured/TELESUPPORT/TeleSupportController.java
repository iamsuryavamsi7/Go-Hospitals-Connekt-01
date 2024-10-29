package com.Go_Work.Go_Work.Controller.Secured.TELESUPPORT;

import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.TELESUPPORT.TeleSupportResponseModel;
import com.Go_Work.Go_Work.Service.Secured.TELESUPPORT.TeleSupportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tele-support")
@RequiredArgsConstructor
public class TeleSupportController {

    private final TeleSupportService teleSupportService;

    @GetMapping("/fetchAllIncompleteSurgeryCarePatientsPaging/{page}/{pageSize}")
    public ResponseEntity<List<TeleSupportResponseModel>> fetchAllIncompleteSurgeryCarePatientsPaging(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize
    ){

        List<TeleSupportResponseModel> fetchedApplications = teleSupportService.fetchAllIncompleteSurgeryCarePatientsPaging(page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

    @GetMapping("/fetchApplicationById/{id}")
    public ResponseEntity<TeleSupportResponseModel> fetchApplicationById(
            @PathVariable("id") Long id
    ) throws ApplicationNotFoundException {

        TeleSupportResponseModel fetchedApplication = teleSupportService.fetchApplicationById(id);

        return ResponseEntity.ok(fetchedApplication);

    }

    @GetMapping("/assign-tele-support-user/{id}")
    public ResponseEntity<String> assignTeleSupportUser(
            @PathVariable("id") Long id,
            HttpServletRequest request
    ) throws ApplicationNotFoundException {

        String successMessage =  teleSupportService.assignTeleSupportUser(id, request);

        return ResponseEntity.ok(successMessage);

    }

    @GetMapping("/fetchMyJobsPaging/{page}/{pageSize}")
    public ResponseEntity<List<TeleSupportResponseModel>> fetchMyJobsPaging(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize,
            HttpServletRequest request
    ){

        List<TeleSupportResponseModel> fetchedApplications = teleSupportService.fetchMyJobsPaging(request, page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

}
