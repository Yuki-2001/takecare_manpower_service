package com.takecare.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.takecare.common.utils.ApplicationUtils.RecordStatusEnum;
import com.takecare.model.UserDetails;

public interface IUserRepository extends JpaRepository<UserDetails, String>, JpaSpecificationExecutor<UserDetails> {

	Optional<UserDetails> findByUserEmailAndStatus(String userEmail, RecordStatusEnum a);

	Optional<UserDetails> findByUserEmail(String username);

	Optional<UserDetails> findByUserEmailAndOtpExpiryTimeAfterAndStatus(String email, LocalDateTime now,
			RecordStatusEnum a);

	Optional<UserDetails> findByOtpTokenAndStatus(String resetToken, RecordStatusEnum a);

	@Query("""
			SELECT r.roleCode
			FROM MasterUserRole ur
			JOIN ur.user u
			JOIN ur.role r
			WHERE u.userEmail = :email
			""")
	List<String> findRoleNamesByUserEmail(@Param("email") String email);

	Optional<UserDetails> findByUserEmailAndStatusNot(String email, RecordStatusEnum dl);
}
