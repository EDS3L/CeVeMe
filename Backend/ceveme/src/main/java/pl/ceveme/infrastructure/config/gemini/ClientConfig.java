package pl.ceveme.infrastructure.config.gemini;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClientConfig {

    @Value("${gemini.api-key}")
    private String API_KEY;

    @Bean
    public Client geminiClient() {
        return Client.builder().apiKey(API_KEY).build();
    }
}
