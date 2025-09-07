package pl.ceveme.domain.model.enums;

import jakarta.persistence.Embeddable;

@Embeddable
public enum LimitEndpointType {
    CV("CV","api/ai/geminiByLink"),
    REFINEMENT("REFINEMENT","api/ai/refinementText");


    private String code;
    private String endpoint;

    LimitEndpointType(String code, String endpoint) {
        this.code = code;
        this.endpoint = endpoint;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }
}
