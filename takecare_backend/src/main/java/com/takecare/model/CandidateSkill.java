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
@Table(name = "candidate_skills", schema = "candidate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(CandidateSkillId.class)
public class CandidateSkill {

	@Id
	@Column(name = "candidate_id")
	private Long candidateId;

	@Id
	@Column(name = "skill_id")
	private Long skillId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "candidate_id", insertable = false, updatable = false)
	private Candidate candidate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "skill_id", insertable = false, updatable = false)
	private Skill skill;
}
