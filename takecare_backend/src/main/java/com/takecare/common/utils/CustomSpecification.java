package com.takecare.common.utils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.takecare.common.dto.CommonGetReqDto.FilterDto;

import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class CustomSpecification<T> {

	@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
	public static <T> Specification<T> build(List<FilterDto> filters) {

		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			for (FilterDto filter : filters) {

				Path<?> path = root.get(filter.getField());

				switch (filter.getOperator()) {

				case EQ -> predicates.add(cb.equal(path, filter.getValue()));

				case NE -> predicates.add(cb.notEqual(path, filter.getValue()));

				case LIKE -> predicates.add(cb.like(cb.lower(path.as(String.class)),
						"%" + filter.getValue().toString().toLowerCase() + "%"));

				case GT -> predicates.add(cb.greaterThan(path.as(Comparable.class), (Comparable) filter.getValue()));

				case GTE ->
					predicates.add(cb.greaterThanOrEqualTo(path.as(Comparable.class), (Comparable) filter.getValue()));

				case LT -> predicates.add(cb.lessThan(path.as(Comparable.class), (Comparable) filter.getValue()));

				case LTE ->
					predicates.add(cb.lessThanOrEqualTo(path.as(Comparable.class), (Comparable) filter.getValue()));

				case IN -> predicates.add(path.in((Collection<?>) filter.getValue()));

				case BETWEEN -> {
					List<?> values = (List<?>) filter.getValue();

					Object v0 = values.get(0);
					Object v1 = values.get(1);

					String val0 = v0.toString();
					String val1 = v1.toString();

					// Matches:
					// 2026-06-03
					// 2026-06-03T10:15:30
					// 2026-06-03 10:15:30
					boolean isDateRange = val0.matches("^\\d{4}-\\d{2}-\\d{2}.*$")
							&& val1.matches("^\\d{4}-\\d{2}-\\d{2}.*$");

					if (isDateRange) {
						LocalDateTime start = ApplicationUtils.parseToLocalDateTime(val0);
						LocalDateTime end = ApplicationUtils.parseToLocalDateTime(val1);

						predicates.add(cb.between(path.as(LocalDateTime.class), start, end));
					} else {

						predicates.add(cb.between(path.as(Comparable.class), (Comparable) v0, (Comparable) v1));
					}
				}
				case IS_NULL -> predicates.add(cb.isNull(path));
				case IS_NOT_NULL -> predicates.add(cb.isNotNull(path));
				}
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}

}
