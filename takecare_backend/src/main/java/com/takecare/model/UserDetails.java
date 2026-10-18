package com.takecare.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.takecare.common.utils.ApplicationUtils.RecordStatusEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "master_users", schema = "master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDetails {

	@Id
	@Column(name = "user_id_pk", length = 36, nullable = false)
	@GeneratedValue(strategy = GenerationType.UUID)
	private String userIdPk;

	@Column(name = "user_name", length = 100, nullable = false)
	private String userName;

	@Column(name = "user_email", length = 255, nullable = false, unique = true)
	private String userEmail;

	@Column(name = "password_hash", length = 255, nullable = false)
	private String password;

	// Date fields
	@Column(name = "user_dob")
	private LocalDate userDob;

	@Column(name = "user_doj")
	private LocalDate userDoj;

	@Column(name = "user_dor")
	private LocalDate userDor;

	// OTP / Authentication
	@Column(name = "forgot_password_otp", length = 10)
	private String forgotPasswordOtp;

	@Column(name = "otp_token", length = 36)
	private String otpToken;

	@Column(name = "otp_expiry_time")
	private LocalDateTime otpExpiryTime;

	@Column(name = "otp_validated")
	private Boolean otpValidated;

	// Login
	@Column(name = "last_login")
	private LocalDateTime lastLogin;

	// Audit
	@Column(name = "created_by", length = 50, nullable = false)
	private String createdBy;

	@Column(name = "created_on")
	private LocalDateTime createdOn;

	@Column(name = "updated_by", length = 50)
	private String updatedBy;

	@Column(name = "updated_on")
	private LocalDateTime updatedOn;

	// Status
	@Enumerated(EnumType.STRING)
	@Column(name = "status", length = 5)
	private RecordStatusEnum status;

	// Search
	@Column(name = "search", length = 1000)
	private String search;
	
	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
	@Builder.Default
	private List<MasterUserRole> userRoles = new ArrayList<>();
}