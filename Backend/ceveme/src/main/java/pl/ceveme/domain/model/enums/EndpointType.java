package pl.ceveme.domain.model.enums;

import jakarta.persistence.Embeddable;


public enum EndpointType {
    CV("CV","/api/ai/geminiByLink"),
    REFINEMENT("REFINEMENT","/api/ai/refinementText");


    private String code;
    private String endpointName;

    EndpointType() {
    }

    EndpointType(String code, String endpointName) {
        this.code = code;
        this.endpointName = endpointName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEndpointName() {
        return endpointName;
    }

    public void setEndpointName(String endpointName) {
        this.endpointName = endpointName;
    }
}
