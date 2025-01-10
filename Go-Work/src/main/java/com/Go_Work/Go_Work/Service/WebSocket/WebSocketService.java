package com.Go_Work.Go_Work.Service.WebSocket;

import com.Go_Work.Go_Work.Entity.TemporaryAppointmentDataEntity;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.FetchPatientDataResponseModel;
import com.Go_Work.Go_Work.Repo.TemporaryAppointmentDataRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final TemporaryAppointmentDataRepo temporaryAppointmentDataRepo;

    public TemporaryAppointmentDataEntity saveOnBoardData(FetchPatientDataResponseModel fetchPatientDataResponseModel) {

        TemporaryAppointmentDataEntity temporaryAppointmentData = new TemporaryAppointmentDataEntity();

        BeanUtils.copyProperties(fetchPatientDataResponseModel, temporaryAppointmentData);

        return temporaryAppointmentDataRepo.save(temporaryAppointmentData);

    }

}
