package com.takecare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takecare.model.Location;

public interface ILocationRepository extends JpaRepository<Location, Long> {
}