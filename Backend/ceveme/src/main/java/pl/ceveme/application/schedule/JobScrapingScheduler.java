package pl.ceveme.application.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.ceveme.application.usecase.scrap.*;

@Component
public class JobScrapingScheduler {

    private static final Logger log = LoggerFactory.getLogger(JobScrapingScheduler.class);

    private final ScrapBulldogJobUseCase scrapBulldogJobUseCase;
    private final ScrapJustJoinItUseCase scrapJustJoinItUseCase;
    private final ScrapLinkedInUseCase scrapLinkedInUseCase;
    private final ScrapNoFluffJobsUseCase scrapNoFluffJobsUseCase;
    private final ScrapPracujPlUseCase scrapPracujPlUseCase;
    private final ScrapRocketJobsUseCase scrapRocketJobsUseCase;
    private final ScrapSolidJobsUseCase scrapSolidJobsUseCase;
    private final ScrapTheProtocolITUseCase scrapTheProtocolITUseCase;

    public JobScrapingScheduler(
            ScrapBulldogJobUseCase scrapBulldogJobUseCase,
            ScrapJustJoinItUseCase scrapJustJoinItUseCase,
            ScrapLinkedInUseCase scrapLinkedInUseCase,
            ScrapNoFluffJobsUseCase scrapNoFluffJobsUseCase,
            ScrapPracujPlUseCase scrapPracujPlUseCase,
            ScrapRocketJobsUseCase scrapRocketJobsUseCase,
            ScrapSolidJobsUseCase scrapSolidJobsUseCase,
            ScrapTheProtocolITUseCase scrapTheProtocolITUseCase) {
        this.scrapBulldogJobUseCase = scrapBulldogJobUseCase;
        this.scrapJustJoinItUseCase = scrapJustJoinItUseCase;
        this.scrapLinkedInUseCase = scrapLinkedInUseCase;
        this.scrapNoFluffJobsUseCase = scrapNoFluffJobsUseCase;
        this.scrapPracujPlUseCase = scrapPracujPlUseCase;
        this.scrapRocketJobsUseCase = scrapRocketJobsUseCase;
        this.scrapSolidJobsUseCase = scrapSolidJobsUseCase;
        this.scrapTheProtocolITUseCase = scrapTheProtocolITUseCase;
    }


     // Główna metoda uruchamiana 2 razy dziennie (16:00 i 1:00).
    @Scheduled(cron = "0 0 16,1 * * *")
    public void runFullScrapingCycle() {
        log.info("Rozpoczynam cykl scrapowania ofert pracy...");

        executeWithLogging("BulldogJob", scrapBulldogJobUseCase::execute);
        executeWithLogging("JustJoinIt", scrapJustJoinItUseCase::execute);
        executeWithLogging("NoFluffJobs", scrapNoFluffJobsUseCase::execute);
        executeWithLogging("RocketJobs", scrapRocketJobsUseCase::execute);
        executeWithLogging("SolidJobs", scrapSolidJobsUseCase::execute);
        executeWithLogging("TheProtocolIT", scrapTheProtocolITUseCase::execute);

        // executeWithLogging("LinkedIn", scrapLinkedInUseCase::execute);
        // executeWithLogging("PracujPl", scrapPracujPlUseCase::execute);

        log.info("Pełny cykl scrapowania został zakończony.");
    }

    private void executeWithLogging(String jobName, ScraperTask task) {
        try {
            log.info("Start scrapowania: {}", jobName);
            task.run();
            log.info("Zakończono scrapowanie: {}", jobName);
        } catch (Exception e) {
            log.error("Błąd podczas pracy scrapera {}: {}", jobName, e.getMessage());
        }
    }

//Interfejs funkcyjny pozwalający przekazać metodę execute() jako parametr.
    @FunctionalInterface
    interface ScraperTask {
        void run() throws Exception;
    }
}