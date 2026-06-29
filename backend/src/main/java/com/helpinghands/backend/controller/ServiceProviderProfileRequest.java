package com.helpinghands.backend.controller;

import jakarta.validation.constraints.NotBlank;

public class ServiceProviderProfileRequest {

    @NotBlank(message = "serviceType is required")
    private String serviceType;

    @NotBlank(message = "operationalRegion is required")
    private String operationalRegion;

    private String policeClearanceUrl;

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getOperationalRegion() {
        return operationalRegion;
    }

    public void setOperationalRegion(String operationalRegion) {
        this.operationalRegion = operationalRegion;
    }

    public String getPoliceClearanceUrl() {
        return policeClearanceUrl;
    }

    public void setPoliceClearanceUrl(String policeClearanceUrl) {
        this.policeClearanceUrl = policeClearanceUrl;
    }
}
