package pl.ceveme.infrastructure.controllers.auth;



import pl.ceveme.application.dto.auth.ActiveUserRequest;
import pl.ceveme.application.dto.auth.ActiveUserResponse;
import pl.ceveme.application.dto.auth.LoginUserRequest;
import pl.ceveme.application.dto.auth.LoginUserResponse;
import pl.ceveme.application.dto.auth.RegisterUserRequest;
import pl.ceveme.application.dto.auth.RegisterUserResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import pl.ceveme.application.usecase.auth.ActiveUserUseCase;
import pl.ceveme.application.usecase.auth.LoginUserUseCase;
import pl.ceveme.application.usecase.auth.RegisterUserUseCase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private LoginUserUseCase loginUserUseCase;

    @Mock
    private RegisterUserUseCase registerUserUseCase;

    @Mock
    private ActiveUserUseCase activeUserUseCase;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void login_ShouldReturnLoginResponse_WhenValidRequest() throws Exception {
        // Given
        LoginUserRequest loginRequest = new LoginUserRequest("test@example.com", "password123");
        LoginUserResponse expectedResponse = new LoginUserResponse(1L, "jwt-token-123", "Login successful");

        when(loginUserUseCase.login(any(LoginUserRequest.class))).thenReturn(expectedResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.token").value("jwt-token-123"))
                .andExpect(jsonPath("$.message").value("Login successful"));

        verify(loginUserUseCase, times(1)).login(any(LoginUserRequest.class));
    }

    @Test
    void login_ShouldCallLoginUseCase_WithCorrectParameters() throws Exception {
        // Given
        LoginUserRequest loginRequest = new LoginUserRequest("user@test.com", "mypassword");
        LoginUserResponse expectedResponse = new LoginUserResponse(2L, "token123", "SUCCESS");

        when(loginUserUseCase.login(loginRequest)).thenReturn(expectedResponse);

        // When
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk());

        // Then
        verify(loginUserUseCase).login(argThat(request ->
                "user@test.com".equals(request.email()) &&
                        "mypassword".equals(request.password())
        ));
    }

    @Test
    void login_ShouldReturnBadRequest_WhenInvalidJsonFormat() throws Exception {
        // Given
        String invalidJson = "{ invalid json }";

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());

        verify(loginUserUseCase, never()).login(any(LoginUserRequest.class));
    }

    @Test
    void login_ShouldReturnUnsupportedMediaType_WhenWrongContentType() throws Exception {
        // Given
        LoginUserRequest loginRequest = new LoginUserRequest("test@example.com", "password");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnsupportedMediaType());

        verify(loginUserUseCase, never()).login(any(LoginUserRequest.class));
    }

    @Test
    void register_ShouldReturnRegisterResponse_WhenValidRequest() throws Exception {
        // Given
        RegisterUserRequest registerRequest = new RegisterUserRequest(
                "John", "Doe", "+48123456789", "john@example.com", "password123"
        );
        RegisterUserResponse expectedResponse = new RegisterUserResponse(
                "John", "Doe", "john@example.com", "User registered successfully"
        );

        when(registerUserUseCase.register(any(RegisterUserRequest.class))).thenReturn(expectedResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("John"))
                .andExpect(jsonPath("$.surname").value("Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.message").value("User registered successfully"));

        verify(registerUserUseCase, times(1)).register(any(RegisterUserRequest.class));
    }

    @Test
    void register_ShouldCallRegisterUseCase_WithCorrectParameters() throws Exception {
        // Given
        RegisterUserRequest registerRequest = new RegisterUserRequest(
                "Jane", "Smith", "+48987654321", "jane@test.com", "securepass"
        );
        RegisterUserResponse expectedResponse = new RegisterUserResponse(
                "Jane", "Smith", "jane@test.com", "Registration successful"
        );

        when(registerUserUseCase.register(registerRequest)).thenReturn(expectedResponse);

        // When
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Then
        verify(registerUserUseCase).register(argThat(request ->
                "Jane".equals(request.name()) &&
                        "Smith".equals(request.surname()) &&
                        "+48987654321".equals(request.phoneNumber()) &&
                        "jane@test.com".equals(request.email()) &&
                        "securepass".equals(request.password())
        ));
    }

    @Test
    void register_ShouldReturnBadRequest_WhenInvalidJsonFormat() throws Exception {
        // Given
        String invalidJson = "{ name: invalid }";

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());

        verify(registerUserUseCase, never()).register(any(RegisterUserRequest.class));
    }

    @Test
    void register_ShouldHandleEmptyRequestBody() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))
                .andExpect(status().isBadRequest());

        verify(registerUserUseCase, never()).register(any(RegisterUserRequest.class));
    }

    @Test
    void register_ShouldReturnUnsupportedMediaType_WhenWrongContentType() throws Exception {
        // Given
        RegisterUserRequest registerRequest = new RegisterUserRequest(
                "Test", "User", "+48111222333", "test@example.com", "password"
        );

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_XML)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isUnsupportedMediaType());

        verify(registerUserUseCase, never()).register(any(RegisterUserRequest.class));
    }

    @Test
    void constructor_ShouldInitializeAllDependencies() {
        // Given
        LoginUserUseCase mockLoginUseCase = mock(LoginUserUseCase.class);
        RegisterUserUseCase mockRegisterUseCase = mock(RegisterUserUseCase.class);
        ActiveUserUseCase mockActiveUseCase = mock(ActiveUserUseCase.class);

        // When
        AuthController controller = new AuthController(mockLoginUseCase, mockRegisterUseCase, mockActiveUseCase);

        // Then
        assertThat(controller).isNotNull();

    }
}