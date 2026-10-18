package com.takecare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.takecare.model.Candidate;

public interface ICandidateRepository extends JpaRepository<Candidate, Long>, JpaSpecificationExecutor<Candidate> {

}