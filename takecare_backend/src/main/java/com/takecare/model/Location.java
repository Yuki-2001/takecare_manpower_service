package com.takecare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "locations",
    schema = "candidate",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_location",
            columnNames = {"name", "state", "country"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 200)
    private String state;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String country = "India";

    @Column(nullable = false, length = 5)
    @Builder.Default
    private String status = "A";
}
