package com.Go_Work.Go_Work.Schedule;

import com.Go_Work.Go_Work.Repo.TokenRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduleTokenDelete {

    private final TokenRepo tokenRepo;

    @Scheduled(
            fixedRate = 600000      // 10 minutes
    )
    public void deleteExpiredOrRevokedTokens(){

        tokenRepo.deleteTokensByExpiredOrRevoked();

        System.out.println("Tokens Deleted");

    }

}