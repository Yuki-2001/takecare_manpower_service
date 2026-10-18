package com.takecare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordReqDto {

    @Email(message = "Email is invalid")
    @NotBlank(message = "Email is Required")
    private String email;

}