package pl.ceveme.infrastructure.external.gemini;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.checkerframework.checker.units.qual.C;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

@Service
public class HttpFetchAi {

    private final Client client;

    @Value("${MODEL}")
    private String model;

    public HttpFetchAi(Client client) {
        this.client = client;
    }

    public GenerateContentResponse getResponse(String prompt) {

        return client.models.generateContent(model,prompt,null);
    }
}

