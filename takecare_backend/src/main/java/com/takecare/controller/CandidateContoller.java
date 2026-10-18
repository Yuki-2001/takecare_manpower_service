package com.takecare.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.takecare.common.dto.CommonGetReqDto;
import com.takecare.common.dto.CommonGetRespDto;
import com.takecare.common.handler.ApplicationException;
import com.takecare.common.handler.ApplicationException.LayerException;
import com.takecare.service.CandidateService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/candidate")
@RequiredArgsConstructor
@Tag(name = "Candidate Management", description = "API for managing candidates")
public class CandidateContoller {

	private final CandidateService candidateService;

	private static final Logger logger = LoggerFactory.getLogger(CandidateContoller.class);

	@PostMapping("search")
	@Operation(summary = "Search Candidates", description = "Search for candidates based on filter criteria")
	@ApiResponse(responseCode = "200", description = "Successfully retrieved candidates", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CommonGetRespDto.class)))
	@ApiResponse(responseCode = "403", description = "Access denied")
	@ApiResponse(responseCode = "500", description = "Internal server error")
	public ResponseEntity<?> searchCandidate(@RequestBody CommonGetReqDto request) {
		try {
			CommonGetRespDto resp = candidateService.searchCandidate(request);
			return resp != null ? ResponseEntity.ok(resp)
					: ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You don't have access"));
		} catch (Exception ex) {
			logger.info("CandidateContoller >> searchCandidate >> Exception : " + ex.getMessage());
			throw new ApplicationException(LayerException.CONTROLLER_LAYER,
					"CandidateContoller >> searchCandidate >> Exception : " + ex.getMessage());
		}
	}

}
