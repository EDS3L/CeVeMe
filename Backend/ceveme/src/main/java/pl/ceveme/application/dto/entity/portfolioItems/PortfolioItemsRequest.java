package pl.ceveme.application.dto.entity.portfolioItems;

import pl.ceveme.domain.model.entities.Skill;

import java.util.EnumSet;

public record PortfolioItemsRequest(Long id, String email, String title, String description) {

    public PortfolioItemsRequest {
        validate(title, description);
    }

    private static void validate(String title, String description) {

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Portfolio name cannot be null!");
        }

        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Portfolio description cannot be null!");

        }
    }


}
