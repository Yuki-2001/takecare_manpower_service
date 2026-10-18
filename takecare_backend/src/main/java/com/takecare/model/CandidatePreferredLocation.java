package com.takecare.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "candidate_preferred_locations", schema = "candidate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(CandidatePreferredLocationId.class)
public class CandidatePreferredLocation {

	@Id
	@Column(name = "candidate_id")
	private Long candidateId;

	@Id
	@Column(name = "location_id")
	private Long locationId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "candidate_id", insertable = false, updatable = false)
	private Candidate candidate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "location_id", insertable = false, updatable = false)
	private Location location;
}
