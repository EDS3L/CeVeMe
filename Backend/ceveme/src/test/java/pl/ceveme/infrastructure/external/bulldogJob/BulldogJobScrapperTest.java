package pl.ceveme.infrastructure.external.bulldogJob;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.common.HttpClient;

import java.io.IOException;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BulldogJobScrapperTest {

    private final String BASE_URL = "https://bulldogjob.com/companies/jobs";
    private final String SAMPLE_HTML = """
            <html>
            <head>
            <script id="__NEXT_DATA__" type="application/json">
                                 {
                                     "props": {
                                         "pageProps": {
                                             "slugState": {
                                                 "perPage": 10
                                             },
                                             "totalCount": 25,
                                             "jobs": [
                                                 {"id": "job-1"},
                                                 {"id": "job-2:}
                                                 ]
                                                 }
                                                 }
                                                 }
            </script>
            </head>            
            </body>
            """;
    private final String JOB_DETAILS_HTML = """
                        <html>
                        <head>
                            <script type="application/ld+json">
                                {
                                    "title": "Java Developer",
                                    "hiringOrganization": {
                                        "name": "Test Company"
                                    },
                                    "description": "Test job description",
                                    "responsibilities": "Test responsibilities"
                                }
                            </script>
                        </head>
                        <body>
                            <div class="flex mt-6">
                                <p class="text-gray-400">Experience</p>
                                <p>Senior</p>
                            </div>
                            <div class="flex mt-6">
                                <p class="text-gray-400">Contract type</p>
                                <p>B2B</p>
                            </div>
                        </body>
                        </html>
            """;
    private JsonNode mockJsonNode;
    private JsonNode mockJsonDetailsNode;

    @Mock
    private HttpClient httpClient;
    @Mock
    private ObjectMapper objectMapper;
    @Mock
    private JobOfferRepository jobOfferRepository;

    @BeforeEach
    void set() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        mockJsonNode = objectMapper.readTree("""
                                              {
                                     "props": {
                                         "pageProps": {
                                             "slugState": {
                                                 "perPage": 10
                                             },
                                             "totalCount": 25,
                                             "jobs": [
                                                 {"id": "job-1"},
                                                 {"id": "job-2:}
                                                 ]
                                                 }
                                                 }
                                                 }
                
                """);
        mockJsonDetailsNode = objectMapper.readTree("""
                           {
                                    "title": "Java Developer",
                                    "hiringOrganization": {
                                        "name": "Test Company"
                                    },
                                    "description": "Test job description",
                                    "responsibilities": "Test responsibilities"
                                }
                """);
    }

//    @Test
//    void createJobs_shouldReturnList_when_ValuesIsTrue() throws IOException {
//        when(httpClient.fetchContent(BASE_URL)).thenReturn(SAMPLE_HTML);
//        when(objectMapper.readTree(anyString())).thenReturn(mockJsonNode);
//
//        JobOffer mockJobOffer = new JobOffer();
//        mockJobOffer.setTitle("Java Developer");
//        mockJobOffer.setCompany("Test Company");
//
//    }


}