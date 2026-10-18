package com.takecare.common.dto;

import java.time.LocalDate;
import java.util.List;

import com.takecare.dto.RoleRespDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppUserDto {

	private String userName;
	private String userEmail;
	private List<String> access;
	private String profileImg;
    private String userIdPk;
    private String status;
    private LocalDate userDob;
    private LocalDate userDoj;
    private LocalDate userDor;
    private String search;
    private String designationIdPk;
    private String designationName;
    private Integer dailyHours;
    private List<RoleRespDto> roles;
    
}