package com.helpinghands.backend.controller;

import jakarta.validation.constraints.NotBlank;

public class ChildrenHomeProfileRequest {

    @NotBlank(message = "homeName is required")
    private String homeName;

    @NotBlank(message = "registrationNumber is required")
    private String registrationNumber;

    private Integer capacity;

    private String bankAccountDetails;

    private String regCertificateUrl;

    public String getHomeName() {
        return homeName;
    }

    public void setHomeName(String homeName) {
        this.homeName = homeName;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getBankAccountDetails() {
        return bankAccountDetails;
    }

    public void setBankAccountDetails(String bankAccountDetails) {
        this.bankAccountDetails = bankAccountDetails;
    }

    public String getRegCertificateUrl() {
        return regCertificateUrl;
    }

    public void setRegCertificateUrl(String regCertificateUrl) {
        this.regCertificateUrl = regCertificateUrl;
    }
}
