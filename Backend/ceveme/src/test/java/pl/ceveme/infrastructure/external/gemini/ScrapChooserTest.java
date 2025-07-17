package pl.ceveme.infrastructure.external.gemini;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class ScrapChooserTest {


    private static final Logger log = LoggerFactory.getLogger(ScrapChooserTest.class);

    @Test
    void should_chooseCorrectPortal_when_givenLink() {
        // given
        String[] links = {
                "https://theprotocol.it/szczegoly/praca/software-engineer-iii-site-reliability-engineering-platforms-infrastructure-warszawa-emilii-plater-53,oferta,2a270000-6214-6e36-5c4c-08ddb943413a?sug=sg_bd_1&s=186398832&searchId=94d08762-c8fe-40f7-a9c5-805ed6052356",
                "https://solid.jobs/offer/24416/scalo-fullstack-developer-kotlin--angular",
                "https://rocketjobs.pl/oferta-pracy/driving-hr-customer-success-specialist-sanok-support-inzynieria-technika-produkcja",
                "https://www.pracuj.pl/praca/java-developer-warszawa,oferta,1004230359?sug=sg_bestmatch_bd_1_tname_252_tgroup_A_boosterAI_L0",
                "https://nofluffjobs.com/pl/job/senior-fullstack-developer-python-vue-js-square-one-resources-remote-xomdi42o",
                "https://bulldogjob.com/companies/jobs/179989-r-d-engineer-c-gdansk-develocraft",
                "https://justjoin.it/job-offer/sii-ai-ml-principal-software-engineer-bialystok-data"
        };
        // when
        String prefix = "https://";
        ArrayList<String> actual = new ArrayList<>();
        for (String url : links) {
            StringBuilder sb = new StringBuilder(url);

            if (sb.indexOf(prefix) == 0) {
                sb.delete(0,prefix.length());
            }
            int slashIndex = sb.indexOf("/");
            if (slashIndex != -1) {
                sb.delete(slashIndex, sb.length());
            }

            actual.add(sb.toString());
        }

        String[] list = {"theprotocol.it",
                "solid.jobs",
                "rocketjobs.pl",
                "www.pracuj.pl",
                "nofluffjobs.com",
                "bulldogjob.com",
                "justjoin.it"
        };

        // then
        assertArrayEquals(list,actual.toArray());

    }

    @Test
    void should_ThrowExpection_when_givenLinkWithoutHttps() {
        // given

        String[] links = {
                "prot.theprotocol.it/szczegoly/praca/software-engineer-iii-site-reliability-engineering-platforms-infrastructure-warszawa-emilii-plater-53,oferta,2a270000-6214-6e36-5c4c-08ddb943413a?sug=sg_bd_1&s=186398832&searchId=94d08762-c8fe-40f7-a9c5-805ed6052356",
                "https://solid.jobs/offer/24416/scalo-fullstack-developer-kotlin--angular",
                "https://rocketjobs.pl/oferta-pracy/driving-hr-customer-success-specialist-sanok-support-inzynieria-technika-produkcja",
                "https://www.pracuj.pl/praca/java-developer-warszawa,oferta,1004230359?sug=sg_bestmatch_bd_1_tname_252_tgroup_A_boosterAI_L0",
                "https://nofluffjobs.com/pl/job/senior-fullstack-developer-python-vue-js-square-one-resources-remote-xomdi42o",
                "https://bulldogjob.com/companies/jobs/179989-r-d-engineer-c-gdansk-develocraft",
                "https://justjoin.it/job-offer/sii-ai-ml-principal-software-engineer-bialystok-data"
        };

        // when
        String prefix = "https://";
        ArrayList<String> actual = new ArrayList<>();
        for (String url : links) {
            StringBuilder sb = new StringBuilder(url);

            if (sb.indexOf(prefix) == 0) {
                sb.delete(0,prefix.length());
            }
            int slashIndex = sb.indexOf("/");
            if (slashIndex != -1) {
                sb.delete(slashIndex, sb.length());
            }

            actual.add(sb.toString());
        }

        String[] list = {"theprotocol.it",
                "solid.jobs",
                "rocketjobs.pl",
                "www.pracuj.pl",
                "nofluffjobs.com",
                "bulldogjob.com",
                "justjoin.it"
        };

        log.info("Protocol: {}", actual.getFirst());

        // then
        assertNotEquals(list,actual.toArray());
        assertFalse(Arrays.equals(list,actual.toArray()));

    }
}