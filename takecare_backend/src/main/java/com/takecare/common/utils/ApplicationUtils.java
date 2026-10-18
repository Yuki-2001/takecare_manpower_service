package com.takecare.common.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import lombok.Getter;

public final class ApplicationUtils {
	
	@Getter
	public enum RecordStatusEnum {

		A("Active"), D("Inactive"), DL("Deleted");

		private final String value;

		RecordStatusEnum(String value) {
			this.value = value;
		}
	}

	public static DateTimeFormatter ddMMyyyy = DateTimeFormatter.ofPattern("dd-MM-yyyy");
	public static DateTimeFormatter ddMMyyyyHHmmSS = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
	public static DateTimeFormatter ddMMyyyyHHmm = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
	
	public static final LocalDate getSystemDate() {
		return LocalDate.now(ZoneId.of("Asia/Kolkata"));
	}

	public static final LocalDateTime getSystemDateTime() {
		return LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
	}

	public static final int getSystemYear() {
		return getSystemDate().getYear();
	}
	
	public static final Long getDaysCount (LocalDate date1, LocalDate date2) {
		return Math.abs(ChronoUnit.DAYS.between(date1, date2));
	}
	
	public static LocalDateTime parseToLocalDateTime(String value) {

	    if (value == null || value.isBlank()) {
	        return null;
	    }

	    value = value.trim();

	    // ISO UTC: 2026-06-30T18:30:00.000Z
	    if (value.endsWith("Z")) {
	        return Instant.parse(value)
	                .atZone(ZoneId.systemDefault())
	                .toLocalDateTime();
	    }

	    // ISO with offset:
	    // 2026-06-30T18:30:00+05:30
	    // 2026-06-30T18:30:00.000+05:30
	    if (value.matches(".*[+-]\\d{2}:\\d{2}$")) {
	        return OffsetDateTime.parse(value)
	                .toLocalDateTime();
	    }

	    // LocalDate
	    if (value.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
	        return LocalDate.parse(value).atStartOfDay();
	    }

	    // yyyy-MM-dd HH:mm:ss
	    if (value.contains(" ")) {
	        return LocalDateTime.parse(
	                value,
	                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	    }

	    // yyyy-MM-ddTHH:mm:ss
	    return LocalDateTime.parse(value);
	}
}
