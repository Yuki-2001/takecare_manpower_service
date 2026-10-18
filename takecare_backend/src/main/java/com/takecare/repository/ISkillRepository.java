package com.takecare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takecare.model.Skill;

public interface ISkillRepository extends JpaRepository<Skill, Long> {
}