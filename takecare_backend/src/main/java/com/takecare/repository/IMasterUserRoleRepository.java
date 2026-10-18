package com.takecare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.takecare.model.MasterUserRole;

public interface IMasterUserRoleRepository
		extends JpaRepository<MasterUserRole, Long>, JpaSpecificationExecutor<MasterUserRole> {

}
