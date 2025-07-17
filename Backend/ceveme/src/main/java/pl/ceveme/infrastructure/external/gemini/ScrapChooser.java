package pl.ceveme.infrastructure.external.gemini;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.infrastructure.external.scrap.bulldogJob.BulldogJobScrapper;
import pl.ceveme.infrastructure.external.scrap.justJoinIt.JustJoinItScrapper;
import pl.ceveme.infrastructure.external.scrap.nofluffjobs.NoFluffJobsScrapper;
import pl.ceveme.infrastructure.external.scrap.pracujPl.PracujPlScrapper;
import pl.ceveme.infrastructure.external.scrap.rocketJobs.RocketJobsScrapper;
import pl.ceveme.infrastructure.external.scrap.solidJobs.SolidJobsScrapper;
import pl.ceveme.infrastructure.external.scrap.theProtocolIt.TheProtocolItScrapper;

@Service
public class ScrapChooser {

    private final JustJoinItScrapper justJoinItScrapper;
    private final BulldogJobScrapper bulldogJobScrapper;
    private final NoFluffJobsScrapper noFluffJobsScrapper;
    private final PracujPlScrapper pracujPlScrapper;
    private final RocketJobsScrapper rocketJobsScrapper;
    private final SolidJobsScrapper solidJobsScrapper;
    private final TheProtocolItScrapper theProtocolItScrapper;


    public ScrapChooser(JustJoinItScrapper justJoinItScrapper, BulldogJobScrapper bulldogJobScrapper, NoFluffJobsScrapper noFluffJobsScrapper, PracujPlScrapper pracujPlScrapper, RocketJobsScrapper rocketJobsScrapper, SolidJobsScrapper solidJobsScrapper, TheProtocolItScrapper theProtocolItScrapper) {
        this.justJoinItScrapper = justJoinItScrapper;
        this.bulldogJobScrapper = bulldogJobScrapper;
        this.noFluffJobsScrapper = noFluffJobsScrapper;
        this.pracujPlScrapper = pracujPlScrapper;
        this.rocketJobsScrapper = rocketJobsScrapper;
        this.solidJobsScrapper = solidJobsScrapper;
        this.theProtocolItScrapper = theProtocolItScrapper;
    }

    public JobOfferRequest chooseCorrectPortal(String url) throws Exception {
        String portalName = getPortalName(url);

        return switch (portalName) {
            case "theprotocol.it" ->
                theProtocolItScrapper.getJobDetails(url);
            case "solid.jobs" ->
                solidJobsScrapper.getJobDetails(url);
            case "rocketjobs.pl" ->
                rocketJobsScrapper.getJobDetails(url);
            case "www.pracuj.pl" ->
                pracujPlScrapper.getJobDetails(url);
            case "nofluffjobs.com" ->
                noFluffJobsScrapper.getJobDetails(url);
            case "bulldogjob.com" ->
                bulldogJobScrapper.getJobDetails(url);
            case "justjoin.it" ->
                justJoinItScrapper.getJobDetails(url);
                default -> throw new IllegalArgumentException("Unknown portal: " + portalName);
        };
    };

    public String getPortalName(String url) {

        StringBuilder sb = new StringBuilder(url);
        String prefix = "https://";
        if (sb.indexOf(prefix) == 0) {
            sb.delete(0,prefix.length());
        }
        int slashIndex = sb.indexOf("/");
        if (slashIndex != -1) {
            sb.delete(slashIndex, sb.length());
        }

        return sb.toString();
    }




}
