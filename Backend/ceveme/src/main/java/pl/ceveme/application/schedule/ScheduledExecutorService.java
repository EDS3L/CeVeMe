package pl.ceveme.application.schedule;


import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.ceveme.application.usecase.scrap.*;

import java.io.IOException;

@Component
public class ScheduledExecutorService {

    private final ScrapBulldogJobUseCase scrapBulldogJobUseCase;
    private final ScrapJustJoinItUseCase scrapJustJoinItUseCase;
    private final ScrapLinkedInUseCase scrapLinkedInUseCase;
    private final ScrapNoFluffJobsUseCase scrapNoFluffJobsUseCase;
    private final ScrapPracujPlUseCase scrapPracujPlUseCase;
    private final ScrapRocketJobsUseCase scrapRocketJobsUseCase;
    private final ScrapSolidJobsUseCase scrapSolidJobsUseCase;
    private final ScrapTheProtocolITUseCase scrapTheProtocolITUseCase;

    public ScheduledExecutorService(ScrapBulldogJobUseCase scrapBulldogJobUseCase, ScrapJustJoinItUseCase scrapJustJoinItUseCase, ScrapLinkedInUseCase scrapLinkedInUseCase, ScrapNoFluffJobsUseCase scrapNoFluffJobsUseCase, ScrapPracujPlUseCase scrapPracujPlUseCase, ScrapRocketJobsUseCase scrapRocketJobsUseCase, ScrapSolidJobsUseCase scrapSolidJobsUseCase, ScrapTheProtocolITUseCase scrapTheProtocolITUseCase) {
        this.scrapBulldogJobUseCase = scrapBulldogJobUseCase;
        this.scrapJustJoinItUseCase = scrapJustJoinItUseCase;
        this.scrapLinkedInUseCase = scrapLinkedInUseCase;
        this.scrapNoFluffJobsUseCase = scrapNoFluffJobsUseCase;
        this.scrapPracujPlUseCase = scrapPracujPlUseCase;
        this.scrapRocketJobsUseCase = scrapRocketJobsUseCase;
        this.scrapSolidJobsUseCase = scrapSolidJobsUseCase;
        this.scrapTheProtocolITUseCase = scrapTheProtocolITUseCase;
    }
//
//    @Scheduled(initialDelay = 60000, fixedDelay = 20000)
//    public void scrapBulldogScheduler() throws IOException {
//        scrapBulldogJobUseCase.execute();
//    }
//
//    @Scheduled(fixedDelay = 20000)
//    public void scrapJustJoinItScheduler() throws Exception {
//        scrapJustJoinItUseCase.execute();
//    }
//
////    @Scheduled(fixedDelay = 20000)
////    public void scrapLinkedInScheduler() throws IOException {
////        scrapLinkedInUseCase.execute();
////    }
//
//    @Scheduled(fixedDelay = 20000)
//    public void scrapNoFluffScheduler() throws IOException {
//        scrapNoFluffJobsUseCase.execute();
//    }
////
////    @Scheduled(fixedDelay = 20000)
////    public void scrapPracujScheduler() throws IOException {
////        scrapPracujPlUseCase.execute();
////    }
//
//    @Scheduled(fixedDelay = 20000)
//    public void scrapRocketScheduler() throws IOException {
//        scrapRocketJobsUseCase.execute();
//    }
//
//    @Scheduled(fixedDelay = 20000)
//    public void scrapSolidJobsScheduler() throws Exception {
//        scrapSolidJobsUseCase.execute();
//    }
//
//    @Scheduled(fixedDelay = 20000)
//    public void scrapTheProtocolITScheduler() throws IOException {
//        scrapTheProtocolITUseCase.execute();
//    }

}

