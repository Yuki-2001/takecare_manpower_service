package com.takecare.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.takecare.dto.ForgotPasswordReqDto;
import com.takecare.dto.LoginReqDto;
import com.takecare.dto.LoginRespDto;
import com.takecare.dto.ResetPasswordRequest;
import com.takecare.dto.VerifyOtpRequest;
import com.takecare.service.AuthService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("auth")
@Tag(name = "Authentication Management", description = "API for managing Auth")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginReqDto req, HttpServletResponse response) {

		LoginRespDto resp = authService.login(req.getUserEmail(), req.getPassword(), response);

		return resp != null ? ResponseEntity.ok(resp)
				: ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("errorMessage", "Invalid User or Password"));

	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordReqDto dto) {

		Boolean resp = authService.forgotPassword(dto);
		return resp != null && resp ? ResponseEntity.ok(Map.of("message", "OTP is sent successfully"))
				: ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid User Email"));
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
		Map<String, String> errMap = new HashMap<>();

		String token = authService.verifyOtp(request, errMap);

		return token != null ? ResponseEntity.ok(Map.of("resetToken", token))
				: ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap.isEmpty() ? "OTP time is expired" : errMap);
	}

	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

		Boolean resp = authService.resetPassword(request);

		return resp != null && resp ? ResponseEntity.ok(Map.of("message", "Password reset is successfully"))
				: ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Retry again"));
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(HttpServletResponse response) {
		authService.logout(response);
		return ResponseEntity.ok("Logged out successfully");
	}

}
