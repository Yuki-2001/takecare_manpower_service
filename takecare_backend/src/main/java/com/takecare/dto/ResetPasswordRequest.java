package com.takecare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {

	@NotBlank(message = "Reset Token is Required")
	private String resetToken;

	@NotBlank(message = "New Password is Required")
	private String newPassword;

}