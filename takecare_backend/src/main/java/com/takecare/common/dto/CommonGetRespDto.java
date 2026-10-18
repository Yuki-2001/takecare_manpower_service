package com.takecare.common.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommonGetRespDto {

	private List<?> content;
	private Integer page;
	private Integer size;
	private Long totalElements;
	private Integer totalPages;
}
