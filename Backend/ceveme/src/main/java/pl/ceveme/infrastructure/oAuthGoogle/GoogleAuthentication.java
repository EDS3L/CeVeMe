package pl.ceveme.infrastructure.oAuthGoogle;

import com.google.api.client.auth.oauth2.AuthorizationCodeFlow;
import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.StoredCredential;
import com.google.api.client.extensions.servlet.auth.oauth2.AbstractAuthorizationCodeServlet;
import com.google.api.client.http.BasicAuthentication;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import jakarta.servlet.ServletException;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

public class GoogleAuthentication extends AbstractAuthorizationCodeServlet {



    @Override
    protected String getRedirectUri(HttpServletRequest req) throws ServletException, IOException {
        GenericUrl url = new GenericUrl(req.getRequestURL().toString());
        url.setRawPath("/oauth2callback");
        return url.build();
    }

    @Override
    protected AuthorizationCodeFlow initializeFlow() throws IOException {
        return new AuthorizationCodeFlow.Builder(BearerToken.authorizationHeaderAccessMethod(),
                new NetHttpTransport(),
                new GsonFactory(),
                new GenericUrl("\"https://oauth2.googleapis.com/token"),
                new BasicAuthentication("s6BhdRkqt3", "7Fjfp0ZBr1KtDRbnfVdmIw"),
                "181495214714-9vhnhcb1ed443cqb18bsrc57rqn86fah.apps.googleusercontent.com",
                "https://server.example.com/authorize").setCredentialDataStore(
                        StoredCredential.getDefaultDataStore(
                                new FileDataStoreFactory(new File("datastoredir"))))
                .build();
    }

    @Override
    protected String getUserId(HttpServletRequest req) throws ServletException, IOException {
        // return user ID
    }
}
