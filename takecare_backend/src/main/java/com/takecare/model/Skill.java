package com.takecare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "skills",
    schema = "candidate"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @Column(nullable = false, length = 5)
    @Builder.Default
    private String status = "A";
}
