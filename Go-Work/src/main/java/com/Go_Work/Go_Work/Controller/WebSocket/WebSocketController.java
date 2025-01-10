package com.Go_Work.Go_Work.Controller.WebSocket;

import com.Go_Work.Go_Work.Entity.TemporaryAppointmentDataEntity;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.FetchPatientDataResponseModel;
import com.Go_Work.Go_Work.Service.WebSocket.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final WebSocketService webSocketService;

    @MessageMapping("/public-page-frontDesk-onboard")
    @SendTo("/frontDeskOnBoardPublicPage/public-page-frontDesk-onboard")
    public TemporaryAppointmentDataEntity fetchPatientDataOnBoardFrontDeskModel(
            @Payload FetchPatientDataResponseModel fetchPatientDataResponseModel
    ){

        fetchPatientDataResponseModel.setTimeStamp(new Date(System.currentTimeMillis()));

        return webSocketService.saveOnBoardData(fetchPatientDataResponseModel);

    }

}
