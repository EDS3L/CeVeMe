package pl.ceveme.infrastructure.config.stripe;


import com.stripe.StripeClient;
import org.apache.hc.core5.http.HttpHeaders;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableConfigurationProperties(StripeProperties.class)
public class StripeConfig {

    @Bean
    StripeClient stripeClient(StripeProperties props) {
        return new StripeClient(props.getApiKey());
    }

    @Bean
    WebClient stripeWebClient(StripeProperties props) {
        return WebClient.builder()
                .baseUrl("https://api.stripe.com")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + props.getApiKey())
                .defaultHeader("Stripe-Version", props.getApiVersion())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
