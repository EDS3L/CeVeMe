package pl.ceveme.application.dto.entity.link;

public record LinkRequest(Long id, String email, String title, String link, Long employmentInfoId) {

    public LinkRequest {
        validate(title, link);
    }

    private static void validate(String title, String link) {

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Link name cannot be null!");
        }

        if (link == null || link.isBlank()) {
            throw new IllegalArgumentException("Link cannot be null!");

        }
    }
}
