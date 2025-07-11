package pl.ceveme.infrastructure.external.gemini.config;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
public class ClientConfig {

    @Value("${GEMINI_API_KEY}")
    private String API_KEY;

    @Bean
    public Client geminiClient() {
        return Client.builder().apiKey(API_KEY).build();
    }
}
