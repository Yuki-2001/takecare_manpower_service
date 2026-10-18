package com.takecare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginReqDto{
	@NotBlank(message = "Email is required")
	@Email(message = "Email is invalid")
    private String userEmail;
	
	@NotBlank(message = "Password is required")
    @Size(min = 2, max = 20, message = "Password must be between 2 and 20 characters")
    private String password;

}

