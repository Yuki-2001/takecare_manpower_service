package com.takecare.common.dto;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommonRespDto {

	private int status;
	private String message;
	private LocalDateTime timestamp;
	private Object data;

	public static ResponseEntity<?> getOkResp(Object data, String msg) {
		return ResponseEntity.ok(CommonRespDto.builder().status(HttpStatus.OK.value()).message(msg)
				.timestamp(LocalDateTime.now()).data(data).build());
	}

	public static ResponseEntity<?> getBadResp(Object data, String msg) {
		return ResponseEntity.badRequest().body(CommonRespDto.builder().status(HttpStatus.BAD_REQUEST.value())
				.message(msg).timestamp(LocalDateTime.now()).data(data).build());
	}
}
