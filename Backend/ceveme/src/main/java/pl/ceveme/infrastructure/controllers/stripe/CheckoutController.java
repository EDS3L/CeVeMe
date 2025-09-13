package pl.ceveme.infrastructure.controllers.stripe;

import com.stripe.model.Price;
import com.stripe.model.checkout.Session;
import com.stripe.service.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.infrastructure.external.stripe.StripeCatalogService;
import pl.ceveme.infrastructure.external.stripe.StripeService;

@RestController
@RequestMapping("/api/payments")
public class CheckoutController {

    private final StripeCatalogService catalogService;
    private final StripeService checkoutService;

    public CheckoutController(StripeCatalogService catalogService, StripeService checkoutService) {
        this.catalogService = catalogService;
        this.checkoutService = checkoutService;
    }

    @PostMapping("/ultimate")
    public ResponseEntity<String> createUltimateAndReturnCheckoutUrl() throws Exception {

        Price price = catalogService.createUltimateSubscriptionPrice();

        Session session = checkoutService.createCheckoutSessionForPrice(price.getId());

        return ResponseEntity.ok(session.getUrl());
    }
}
