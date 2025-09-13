package pl.ceveme.infrastructure.external.stripe;

import com.stripe.StripeClient;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.net.RequestOptions;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.ProductCreateParams;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class StripeCatalogService {

    private final StripeClient stripeClient;

    public StripeCatalogService(StripeClient stripeClient) {
        this.stripeClient = stripeClient;
    }

    public Price createUltimateSubscriptionPrice() throws Exception {
        Product product = stripeClient.products().create(
                ProductCreateParams.builder()
                        .setName("Ultime suription")
                        .setDescription("Subskrypcja miesięczna")
                        .build(),
                RequestOptions.builder()
                        .setIdempotencyKey("prod-" + UUID.randomUUID())
                        .build()
        );


        PriceCreateParams priceParams = PriceCreateParams.builder()
                .setCurrency("pln")
                .setUnitAmount(200000L)
                .setProduct(product.getId())
                .build();

        return stripeClient.prices().create(
                priceParams,
                RequestOptions.builder()
                        .setIdempotencyKey("price-" + UUID.randomUUID())
                        .build()
        );
    }
}
