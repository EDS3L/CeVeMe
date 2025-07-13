package pl.ceveme.infrastructure.external.gemini;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiHttpClient {

    private final Client client;

    @Value("${MODEL}")
    private String model;

    public GeminiHttpClient(Client client) {
        this.client = client;
    }

    public GenerateContentResponse getResponse(String prompt) {

        return client.models.generateContent(model,prompt,null);
    }
}

