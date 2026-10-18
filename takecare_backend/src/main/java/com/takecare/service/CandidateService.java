package com.takecare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.takecare.common.dto.CommonGetReqDto;
import com.takecare.common.dto.CommonGetRespDto;
import com.takecare.common.handler.ApplicationException;
import com.takecare.common.handler.ApplicationException.LayerException;
import com.takecare.common.utils.CustomSpecification;
import com.takecare.model.Candidate;
import com.takecare.repository.ICandidateRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateService {

	private static final Logger logger = LoggerFactory.getLogger(CandidateService.class);

	private final ICandidateRepository candidateRepository;

	public CommonGetRespDto searchCandidate(CommonGetReqDto request) {
		CommonGetRespDto resp = null;

		try {

			Specification<Candidate> spec = CustomSpecification.build(request.getFilters());

			Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
					CommonGetReqDto.buildSort(request.getSort()));

			Page<Candidate> page = candidateRepository.findAll(spec, pageable);

			resp = CommonGetRespDto.builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
					.totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).build();
		} catch (Exception ex) {
			logger.info("CandidateService >> searchCandidate >> Exception : " + ex.getMessage());
			throw new ApplicationException(LayerException.SERVICE_LAYER,
					"CandidateService >> searchCandidate >> Exception : " + ex.getMessage());
		}
		return resp;

	}

}
