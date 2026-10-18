package com.takecare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takecare.model.Company;

public interface ICompanyRepository extends JpaRepository<Company, Long> {
}