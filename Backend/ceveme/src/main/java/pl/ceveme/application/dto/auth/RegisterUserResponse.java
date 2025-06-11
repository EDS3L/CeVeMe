package pl.ceveme.application.dto.auth;

import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.model.vo.Name;
import pl.ceveme.domain.model.vo.Surname;

public record RegisterUserResponse(String name, String surname, String email, String message) {
}
