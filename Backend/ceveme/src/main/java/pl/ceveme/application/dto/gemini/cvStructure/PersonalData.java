package pl.ceveme.application.dto.gemini.cvStructure;

import java.util.List;

public record PersonalData(String name, String city, String phoneNumber, String email, List<Link> links, String images) {
}
