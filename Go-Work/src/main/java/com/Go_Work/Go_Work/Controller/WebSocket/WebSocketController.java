package com.Go_Work.Go_Work.Controller.WebSocket;

import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Entity.TemporaryAppointmentDataEntity;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.FetchPatientDataResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.BookAppointmentWebSocketModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.ConsultationQueueMedicalSupportModel;
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

    @MessageMapping("/book-appointment-send-to-medical-support-user")
    @SendTo("/medicalSupportUserNotification/newNotifications")
    public Notification bookAppointmentSendToMedicalSupportUser(
            @Payload BookAppointmentWebSocketModel bookAppointmentWebSocketModel
    ){

        System.out.println("\n\n\nNew Notification Sent\n\n\n");

        return webSocketService.bookAppointmentSendToMedicalSupportUser(bookAppointmentWebSocketModel);

    }

}
