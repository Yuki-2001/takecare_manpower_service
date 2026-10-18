package com.takecare.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.takecare.common.dto.AppUserDto;
import com.takecare.common.utils.ApplicationUtils.RecordStatusEnum;
import com.takecare.dto.RoleRespDto;
import com.takecare.model.MasterRole;
import com.takecare.model.UserDetails;
import com.takecare.repository.IMasterRoleRepository;
import com.takecare.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);

	private final IUserRepository userRepo;
	private final AuthService authService;
	private final IMasterRoleRepository roleRepository;

	public AppUserDto getSessionUserDetails() {
		
		logger.info("UserService >> getSessionUserDetails >> Start");
		
		AppUserDto userResp = null;
		String email = AuthService.getAuthUser();
		if (email == null) {
			return userResp;
		}

		Optional<UserDetails> userOpt = userRepo.findByUserEmailAndStatusNot(email, RecordStatusEnum.DL);
		List<String> roleNames = userRepo.findRoleNamesByUserEmail(email);
		if (userOpt.isPresent()) {
			UserDetails user = userOpt.get();
			List<MasterRole> roles = null;
			List<RoleRespDto> roleRespDtos = new ArrayList<>();
			if (roleNames != null && !roleNames.isEmpty()) {
				roles = roleRepository.findByRoleCodeIn(roleNames);
			}
			
			if(roles != null || !roles.isEmpty()) {
				roles.stream().forEach(role -> {
					RoleRespDto roleRespDto = RoleRespDto.builder().roleIdPk(role.getRoleIdPk())
							.roleName(role.getRoleName())
							.roleCode(role.getRoleCode()).roleDescription(role.getRoleDescription()).build();
					roleRespDtos.add(roleRespDto);
				});
			}
			userResp = AppUserDto.builder().userIdPk(user.getUserIdPk()).userName(user.getUserName())

					.status(user.getStatus() != null ? user.getStatus().getValue() : null).userDob(user.getUserDob())
					.userDoj(user.getUserDoj()).userDor(user.getUserDor()).roles(roleRespDtos).search(user.getSearch())
					.access(authService.getAccessCodesByEmail(email)).build();
		}
		return userResp;
	}
}
