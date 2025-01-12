package com.Go_Work.Go_Work.Controller.WebSocket;

import com.Go_Work.Go_Work.Entity.Enum.NotificationStatus;
import com.Go_Work.Go_Work.Entity.Notification;
import com.Go_Work.Go_Work.Entity.TemporaryAppointmentDataEntity;
import com.Go_Work.Go_Work.Error.ApplicationNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.FRONTDESK.FetchPatientDataResponseModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.AcceptCrossConsultationModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.BookAppointmentWebSocketModel;
import com.Go_Work.Go_Work.Model.Secured.MEDICALSUPPORT.CrossConsultationApplicationIDModel;
import com.Go_Work.Go_Work.Model.WebSocket.WebSocketNotificationType;
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

    // Common WEBSOCKETS
    @MessageMapping("/commonWebSocket")
    @SendTo("/common/commonFunction")
    public WebSocketNotificationType commonFunction(
            @Payload WebSocketNotificationType webSocketNotificationType
    ){

        System.out.println("WebSocketNotificationType : " + webSocketNotificationType.getNotificationType() + "\n\n\n");

        return webSocketNotificationType;

    }

    // FrontDesk WEBSOCKETS
    @MessageMapping("/public-page-frontDesk-onboard")
    @SendTo("/frontDeskOnBoardPublicPage/public-page-frontDesk-onboard")
    public TemporaryAppointmentDataEntity fetchPatientDataOnBoardFrontDeskModel(
            @Payload FetchPatientDataResponseModel fetchPatientDataResponseModel
    ){

        fetchPatientDataResponseModel.setTimeStamp(new Date(System.currentTimeMillis()));

        return webSocketService.saveOnBoardData(fetchPatientDataResponseModel);

    }

    @MessageMapping("/sendRequestToFrontDeskCrossConsultation")
    @SendTo("/frontDeskUserNotification/newNotifications")
    public Notification sendRequestToFrontDeskCrossConsultation(
            @Payload CrossConsultationApplicationIDModel crossConsultationApplicationIDModel
    ) throws ApplicationNotFoundException {

        return webSocketService.sendRequestToFrontDeskCrossConsultation(crossConsultationApplicationIDModel);

    }




    // Medical Support User WebSockets
    @MessageMapping("/book-appointment-send-to-medical-support-user")
    @SendTo("/medicalSupportUserNotification/newNotifications")
    public Notification bookAppointmentSendToMedicalSupportUser(
            @Payload BookAppointmentWebSocketModel bookAppointmentWebSocketModel
    ){

        Notification newNotification = new Notification();

        newNotification.setNotificationStatus(NotificationStatus.BOOKAPPOINTMENT);

        return newNotification;

    }

    @MessageMapping("/acceptCrossConsultation")
    @SendTo("/medicalSupportUserNotification/newNotifications")
    public Notification acceptCrossConsultation(
            @Payload AcceptCrossConsultationModel acceptCrossConsultationModel
    ) throws ApplicationNotFoundException {

        return webSocketService.acceptCrossConsultation(acceptCrossConsultationModel);

    }

}
