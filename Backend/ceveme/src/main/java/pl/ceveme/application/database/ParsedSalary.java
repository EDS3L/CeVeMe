package pl.ceveme.application.database;

import pl.ceveme.domain.model.enums.SalaryType;

public record ParsedSalary(Double min, Double max, String currency, SalaryType type) {
}
