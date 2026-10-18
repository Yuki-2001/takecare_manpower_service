package com.takecare.common.dto;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonGetReqDto {

	@Schema(example = "0")
	private Integer page = 0;
	@Schema(example = "10")
	private int size = 10;
	private List<FilterDto> filters;
	private List<SortDto> sort;

	public static enum FilterOperator {
		EQ, NE, LIKE, GT, LT, GTE, LTE, IN, BETWEEN, IS_NULL, IS_NOT_NULL
	}

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class FilterDto {
		@Schema(example = "status")
		private String field;
		private FilterOperator operator;
		@Schema(example = "A")
		private Object value;
	}

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class SortDto {
		@Schema(example = "updatedOn")
		private String field;
		@Schema(example = "DESC")
		private Direction direction;
	}

	public static Sort buildSort(List<SortDto> sorts) {
		if (sorts == null || sorts.isEmpty()) {
			return Sort.unsorted();
		}

		return Sort.by(sorts.stream().map(s -> new Sort.Order(s.getDirection(), s.getField())).toList());
	}

}