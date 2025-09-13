package pl.ceveme.infrastructure.external.stripe;

import com.stripe.StripeClient;
import com.stripe.examples.ExampleTemplate;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.model.v2.EventDestination;
import com.stripe.net.RequestOptions;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.v2.core.EventDestinationListParams;
import org.springframework.stereotype.Service;
import pl.ceveme.infrastructure.config.stripe.StripeProperties;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class StripeService {

    private final StripeClient stripeClient;
    private final StripeProperties props;

    public StripeService(StripeClient stripeClient, StripeProperties props) {
        this.stripeClient = stripeClient;
        this.props = props;
    }

    public Session createCheckoutSessionForPrice(String priceId) throws Exception {
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build()
                )
                .setSuccessUrl("https://www.youtube.com/watch?v=C7dPqrmDWxs&list=RDC7dPqrmDWxs&start_radio=1&ab_channel=PharrellWilliamsVEVO")
                .setCancelUrl("https://www.youtube.com/watch?v=upRA1Lbg8lk&list=RDupRA1Lbg8lk&start_radio=1&t=1s&ab_channel=Pain")
                .build();

        return stripeClient.checkout().sessions().create(
                params,
                RequestOptions.builder()
                        .setIdempotencyKey("checkout-" + UUID.randomUUID())
                        .build()
        );
    }

}
