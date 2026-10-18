package com.takecare.common.handler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;

import com.takecare.common.dto.CommonRespDto;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<CommonRespDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors()
				.forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

		CommonRespDto respError = CommonRespDto.builder().status(HttpStatus.BAD_REQUEST.value())
				.message("Validation failed").timestamp(LocalDateTime.now()).data(errors).build();

		return new ResponseEntity<>(respError, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ApplicationException.class)
	public ResponseEntity<CommonRespDto> handleApplicationException(ApplicationException ex) {
		logger.error(ex.getMessage(), ex);
		CommonRespDto error = CommonRespDto.builder().status(HttpStatus.INTERNAL_SERVER_ERROR.value())
				.message(ex.getMessage()).timestamp(LocalDateTime.now()).build();
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(AsyncRequestNotUsableException.class)
    public void handleAsyncRequestNotUsableException(AsyncRequestNotUsableException ex) {
        logger.warn("Client aborted the connection: {}", ex.getMessage());
    }
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleGenericException(Exception ex, HttpServletRequest request) {
		
		ex.printStackTrace();
		logger.error(ex.getMessage(), ex);

		String uri = request.getRequestURI();

		// If video streaming API → return plain text or empty response
		if (uri.contains("/stream")) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.TEXT_PLAIN)
					.body("Error while streaming video");
		}

		CommonRespDto error = CommonRespDto.builder().status(HttpStatus.INTERNAL_SERVER_ERROR.value())
				.message("Unexpected error: " + ex.getMessage()).timestamp(LocalDateTime.now()).build();
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
