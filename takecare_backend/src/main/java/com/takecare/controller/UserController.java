package com.takecare.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.takecare.common.dto.AppUserDto;
import com.takecare.common.handler.ApplicationException;
import com.takecare.common.handler.ApplicationException.LayerException;
import com.takecare.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("user")
@Tag(name = "User Management", description = "API for managing User")
public class UserController {

	private final UserService userService;

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);
	
	@GetMapping("session")
	public ResponseEntity<?> getSessionUserDetails() {
		try {
			AppUserDto resp = userService.getSessionUserDetails();
			return resp != null ? ResponseEntity.ok(resp)
					: ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "session Expired"));
		} catch (Exception ex) {
			logger.info("UserController >> getSessionUserDetails >> Exception : " + ex.getMessage());
			throw new ApplicationException(LayerException.CONTROLLER_LAYER,
					"UserController >> getSessionUserDetails >> Exception : " + ex.getMessage());
		}
	}
}
