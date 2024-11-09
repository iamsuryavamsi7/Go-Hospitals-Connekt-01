package com.Go_Work.Go_Work.Controller.Public;

import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Service.Public.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final PublicService publicService;

    @PostMapping("/uploadSurgeryDocuments/{applicationId}/{userId}")
    public ResponseEntity<String> uploadPrescription(
            @PathVariable("applicationId") Long applicationId,
            @PathVariable("userId") Long userId,
            @RequestParam("imageFile") List<MultipartFile> imageFile
    ) throws ApplicationNotFoundException, IOException {

        String successMessage = publicService.uploadSurgeryDocuments(applicationId, imageFile, userId);

        return ResponseEntity.ok(successMessage);

    }

}
