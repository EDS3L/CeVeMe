package pl.ceveme.application.usecase.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.auth.LoginUserRequest;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.domain.services.jwt.RefreshTokenService;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;
import pl.ceveme.infrastructure.config.jwt.JwtService;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class LoginUserUseCaseTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private BCryptPasswordEncoderAdapter passwordEncoderAdapter;
    @Mock
    private JwtService jwtService;
    @Mock
    private RefreshTokenService refreshTokenService;
    @Mock
    private HttpServletRequest servletRequest;
    @Mock
    private HttpServletResponse servletResponse;

    @InjectMocks
    private LoginUserUseCase loginUserUseCase;


    @Test
    @DisplayName("Test should gave Login successful credentials are valid")
    void should_returnResponseWihToken_when_credentialsAreValid() {
        // given
        var request = new LoginUserRequest("mta1997@wp.pl", "Test1234!");
        var email = new Email(request.email());
        var user = new User();
        user.setPassword("encodedPassword");
        user.setActive(true);

        when(userRepository.existsByEmail(email)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoderAdapter.matches(request.password(), user.getPassword())).thenReturn(true);
        when(refreshTokenService.createRefreshToken(eq(user), any())).thenReturn("mocked.refresh.token");
        when(jwtService.generateAccessToken(eq(email), anyString(), any())).thenReturn("mocked.jwt.token");

        // When
        var response = loginUserUseCase.login(request, servletResponse, servletRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.message()).isEqualTo("Login successful!");
    }


    @Test
    @DisplayName("Test should gave Invalid credentials credentials are not valid")
    void should_returnResponseWihInvalidCredentials_when_credentialsAreNotValid() {
        // given
        var request = new LoginUserRequest("mta1997@wp.pl", "Test1234!");
        var email = new Email(request.email());
        var user = new User();
        user.setPassword("encodedPassword");
        user.setActive(true);

        when(userRepository.existsByEmail(email)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoderAdapter.matches(request.password(), user.getPassword())).thenReturn(false);

        // when + then
        var exception = assertThrows(IllegalArgumentException.class, () -> loginUserUseCase.login(request, servletResponse, servletRequest));
        assertThat(exception.getMessage()).isEqualTo("Invalid credentials");
    }
}