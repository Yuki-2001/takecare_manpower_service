package com.takecare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.takecare.model.MasterRole;

public interface IMasterRoleRepository extends JpaRepository<MasterRole, Long>, JpaSpecificationExecutor<MasterRole>{

	List<MasterRole> findByRoleNameIn(List<String> roleNames);

	List<MasterRole> findByRoleCodeIn(List<String> roleNames);

}
