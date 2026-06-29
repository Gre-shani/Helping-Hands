package com.helpinghands.backend.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class DeliveryVolunteerProfileRequest {

    @NotBlank(message = "nicFrontImage is required")
    @JsonProperty("nicFrontImage")
    private String nicFrontImage;

    @NotBlank(message = "nicBackImage is required")
    @JsonProperty("nicBackImage")
    private String nicBackImage;

    public String getNicFrontImage() {
        return nicFrontImage;
    }

    public void setNicFrontImage(String nicFrontImage) {
        this.nicFrontImage = nicFrontImage;
    }

    public String getNicBackImage() {
        return nicBackImage;
    }

    public void setNicBackImage(String nicBackImage) {
        this.nicBackImage = nicBackImage;
    }
}
