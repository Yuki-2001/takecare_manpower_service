
package com.takecare.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "master_user_roles", schema = "master", uniqueConstraints = {
		@UniqueConstraint(name = "uk_user_role", columnNames = { "user_id_fk", "role_id_fk" }) })
@Getter
@Setter
public class MasterUserRole {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_role_id_pk")
	private Long userRoleIdPk;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id_fk", referencedColumnName = "user_id_pk")
	private UserDetails user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_id_fk", referencedColumnName = "role_id_pk")
	private MasterRole role;

	@Column(name = "created_by", length = 50, nullable = false)
	private String createdBy;

	@Column(name = "created_on", nullable = false)
	private LocalDateTime createdOn;
}
