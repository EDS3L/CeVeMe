package pl.ceveme.domain.model.enums;

import jakarta.persistence.Embeddable;

@Embeddable
public enum UserRole {
    FREE, PREMIUM, ENTERPRISE
}
