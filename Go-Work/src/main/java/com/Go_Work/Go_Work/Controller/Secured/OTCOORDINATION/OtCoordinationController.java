package com.Go_Work.Go_Work.Controller.Secured.OTCOORDINATION;

import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Service.Secured.OTCOORDINATION.OtCoorindationService;
import lombok.RequiredArgsConstructor;
import org.apache.el.parser.BooleanNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ot-coordination")
public class OtCoordinationController {

    private final OtCoorindationService otCoorindationService;

    @GetMapping("/fetchAllCurrentSurgeries/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllCurrentSurgeries(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize
    ){

        List<ApplicationsResponseModel> fetchedApplications = otCoorindationService.fetchAllCurrentSurgeries(page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

    @GetMapping("/fetchAllFutureSurgeries/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllFutureSurgeries(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize
    ){

        List<ApplicationsResponseModel> fetchedApplications = otCoorindationService.fetchAllFutureSurgeries(page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

    @GetMapping("/fetchAllCompleteApplications/{page}/{pageSize}")
    public ResponseEntity<List<ApplicationsResponseModel>> fetchAllCompleteApplications(
            @PathVariable("page") int page,
            @PathVariable("pageSize") int pageSize
    ){

        List<ApplicationsResponseModel> fetchedApplications = otCoorindationService.fetchAllCompleteApplications(page, pageSize);

        return ResponseEntity.ok(fetchedApplications);

    }

    @GetMapping("/surgeryStartedFunction/{applicationID}")
    public ResponseEntity<Boolean> surgeryStartedFunction(
            @PathVariable("applicationID") Long applicationID
    )throws ApplicationNotFoundException {

        Boolean booleanValue = otCoorindationService.surgeryStartedFunction(applicationID);

        return ResponseEntity.ok(booleanValue);

    }

    @GetMapping("/surgeryEndedFunction/{applicationID}")
    public ResponseEntity<Boolean> surgeryEndedFunction(
            @PathVariable("applicationID") Long applicationID
    )throws ApplicationNotFoundException {

        Boolean booleanValue = otCoorindationService.surgeryEndedFunction(applicationID);

        return ResponseEntity.ok(booleanValue);

    }

}
