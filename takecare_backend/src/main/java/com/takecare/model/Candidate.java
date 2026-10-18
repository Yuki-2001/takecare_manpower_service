package com.takecare.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.takecare.utils.CandidateUtils.AvailabilityStatusType;
import com.takecare.utils.CandidateUtils.GenderType;
import com.takecare.utils.CandidateUtils.MaritalStatusType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "candidates", schema = "candidate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Identity

	@Column(name = "full_name", nullable = false, length = 200)
	private String fullName;

	@Column(name = "email", length = 320)
	private String email;

	@Column(name = "phone", length = 30)
	private String phone;

	// Personal

	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;

	@JdbcTypeCode(SqlTypes.NAMED_ENUM)
	@Enumerated(EnumType.STRING)
	@Column(name = "gender")
	private GenderType gender;

	@JdbcTypeCode(SqlTypes.NAMED_ENUM)
	@Enumerated(EnumType.STRING)
	@Column(name = "marital_status")
	private MaritalStatusType maritalStatus;

	@Column(name = "home_town", length = 200)
	private String homeTown;

	@Column(name = "pin_code", length = 20)
	private String pinCode;

	@Column(name = "permanent_address")
	private String permanentAddress;

	// Location

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "current_location_id")
	private Location currentLocation;

	// Professional

	@Column(name = "total_experience_months", nullable = false)
	@Builder.Default
	private Integer totalExperienceMonths = 0;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "current_company_id")
	private Company currentCompany;

	@Column(name = "current_designation", length = 250)
	private String currentDesignation;

	@Column(name = "department", length = 250)
	private String department;

	@Column(name = "role", length = 250)
	private String role;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "industry_id")
	private Industry industry;

	// Compensation

	@Column(name = "current_salary_amount", precision = 15, scale = 2)
	private BigDecimal currentSalaryAmount;
	
	@Column(name = "salary_currency", length = 3, nullable = false)
	@Builder.Default
	private String salaryCurrency = "INR";

	// Availability
	@JdbcTypeCode(SqlTypes.NAMED_ENUM)
	@Enumerated(EnumType.STRING)
	@Column(name = "availability_status")
	private AvailabilityStatusType availabilityStatus;

	@Column(name = "notice_period_days")
	private Integer noticePeriodDays;

	// Other

	@Column(name = "work_permit_usa")
	private Boolean workPermitUsa;

	// Profile

	@Column(name = "resume_headline")
	private String resumeHeadline;

	@Column(name = "summary")
	private String summary;

	@Column(name = "hr_review", length = 500)
	private String hrReview;

	// Status

	@Column(name = "status", nullable = false, length = 5)
	@Builder.Default
	private String status = "A";

	// Audit

	@Column(name = "created_at", nullable = false)
	private OffsetDateTime createdAt;

	@Column(name = "created_by")
	private Long createdBy;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	@Column(name = "updated_by")
	private Long updatedBy;

	@PrePersist
	protected void onCreate() {

		OffsetDateTime now = OffsetDateTime.now();

		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	protected void onUpdate() {

		updatedAt = OffsetDateTime.now();
	}
}
