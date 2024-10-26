package com.Go_Work.Go_Work.Service.Secured.PHARMACY;

import com.Go_Work.Go_Work.Entity.Applications;
import com.Go_Work.Go_Work.Entity.User;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Error.AppointmentNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.ApplicationsResponseModel;
import com.Go_Work.Go_Work.Repo.ApplicationsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import com.Go_Work.Go_Work.Entity.Enum.ConsultationType;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final ApplicationsRepo applicationsRepo;

    public ApplicationsResponseModel fetchApplicationById(Long id) throws AppointmentNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(id).orElseThrow(
                () -> new AppointmentNotFoundException("Id Not Found")
        );

        ApplicationsResponseModel application1 = new ApplicationsResponseModel();

        BeanUtils.copyProperties(fetchedApplication, application1);

        User fetchedMedicalSupportUserDetails = fetchedApplication.getMedicalSupportUser();

        if ( fetchedMedicalSupportUserDetails != null ){

            application1.setMedicalSupportUserId(fetchedMedicalSupportUserDetails.getId());
            application1.setMedicalSupportUserName(fetchedMedicalSupportUserDetails.getFirstName() + " " + fetchedMedicalSupportUserDetails.getLastName());

        } else {

            application1.setMedicalSupportUserId(null);
            application1.setMedicalSupportUserName(null);

        }

        return application1;

    }

    public String consultationCompleted(Long applicationId) throws ApplicationNotFoundException {

        Applications fetchedApplication = applicationsRepo.findById(applicationId).orElseThrow(
                () -> new ApplicationNotFoundException("Application Not Found")
        );

        fetchedApplication.setPaymentDone(true);
        fetchedApplication.setApplicationCompletedTime(new Date(System.currentTimeMillis()));
        fetchedApplication.setPaymentDoneTime(new Date(System.currentTimeMillis()));
        fetchedApplication.setConsultationType(ConsultationType.COMPLETED);

        applicationsRepo.save(fetchedApplication);

        return "Application Completed";

    }

    public List<ApplicationsResponseModel> fetchAllPharmacyMedications() {

        return applicationsRepo.findAll()
                .stream()
                .filter(applications -> !applications.getConsultationType().equals(ConsultationType.WAITING) && !applications.getConsultationType().equals(ConsultationType.COMPLETED) && applications.getMedicalSupportUser() != null )
                .map(application1 -> {

                    ApplicationsResponseModel application = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, application);

                    User fetchedMedicalSupportUser = application1.getMedicalSupportUser();

                    application.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                    application.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                    return application;

                })
                .collect(Collectors.toList());

    }

    public List<ApplicationsResponseModel> fetchAllPharmacyCompletedMedications() {

        return applicationsRepo.findAll()
                .stream()
                .filter(applications -> applications.getConsultationType().equals(ConsultationType.COMPLETED) )
                .map(application1 -> {

                    ApplicationsResponseModel application = new ApplicationsResponseModel();

                    BeanUtils.copyProperties(application1, application);

                    User fetchedMedicalSupportUser = application1.getMedicalSupportUser();

                    application.setMedicalSupportUserId(fetchedMedicalSupportUser.getId());
                    application.setMedicalSupportUserName(fetchedMedicalSupportUser.getFirstName() + " " + fetchedMedicalSupportUser.getLastName());

                    return application;

                })
                .collect(Collectors.toList());

    }

}
