package com.takecare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleRespDto {

	private Long roleIdPk;
	private String roleName;
	private String roleCode;
	private String roleDescription;
}
