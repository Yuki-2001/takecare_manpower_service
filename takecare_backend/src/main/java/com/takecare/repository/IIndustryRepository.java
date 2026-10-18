package com.takecare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takecare.model.Industry;

public interface IIndustryRepository extends JpaRepository<Industry, Long> {
}