package pl.ceveme.infrastructure.external.gemini;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.gemini.TextRefinementRequest;
import pl.ceveme.application.dto.gemini.TextRefinementResult;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class TextRefinementService {

    private final UserRepository userRepository;
    private final GeminiHttpClient geminiHttpClient;

    public TextRefinementService(UserRepository userRepository, GeminiHttpClient geminiHttpClient) {
        this.userRepository = userRepository;
        this.geminiHttpClient = geminiHttpClient;
    }

    @Transactional
    public TextRefinementResult refinementRequirements(TextRefinementRequest request, Long userId) throws AccessDeniedException {
       User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        EmploymentInfo info = user.getEmploymentInfo();

        if (info.getUser()
                .getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        String response = geminiHttpClient.getResponse(TextRefinementPromptBuilder.createPrompt(request.text())).text();

        return new TextRefinementResult(response, "Refinement successfully!");

    }
//
//    @Transactional
//    public TextRefinementResult refinementJobAchievements(TextRefinementRequest request, Long userId) throws AccessDeniedException {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
//
//        EmploymentInfo info = user.getEmploymentInfo();
//
//        if (info.getUser()
//                .getId() != userId) {
//            throw new AccessDeniedException("Access Denied!");
//        }
//        if(info.getExperienceById(request.itemId())
//                .isEmpty()) throw new IllegalArgumentException("Employment info not found!");
//
//        String requirements = info.getExperienceById(request.itemId()).get().getJobAchievements();
//        String response = geminiHttpClient.getResponse(TextRefinementPromptBuilder.createPrompt(requirements)).text();
//
//        return new TextRefinementResult(response, "Refinement successfully!");
//
//    }
//
//    @Transactional
//    public TextRefinementResult refinementCourseDescription(TextRefinementRequest request, Long userId) throws AccessDeniedException {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
//
//        EmploymentInfo info = user.getEmploymentInfo();
//
//        if (info.getUser()
//                .getId() != userId) {
//            throw new AccessDeniedException("Access Denied!");
//        }
//        if(info.getCourseById(request.itemId())
//                .isEmpty()) throw new IllegalArgumentException("Employment info not found!");
//
//        String requirements = info.getCourseById(request.itemId()).get().getCourseDescription();
//        String response = geminiHttpClient.getResponse(TextRefinementPromptBuilder.createPrompt(requirements)).text();
//
//        return new TextRefinementResult(response, "Refinement successfully!");
//
//    }
//
//    @Transactional
//    public TextRefinementResult refinementPortfolioDescription(TextRefinementRequest request, Long userId) throws AccessDeniedException {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
//
//        EmploymentInfo info = user.getEmploymentInfo();
//
//        if (info.getUser()
//                .getId() != userId) {
//            throw new AccessDeniedException("Access Denied!");
//        }
//        if(info.getPortfolioItemById(request.itemId())
//                .isEmpty()) throw new IllegalArgumentException("Employment info not found!");
//
//        String requirements = info.getPortfolioItemById(request.itemId()).get().getDescription();
//        String response = geminiHttpClient.getResponse(TextRefinementPromptBuilder.createPrompt(requirements)).text();
//
//        return new TextRefinementResult(response, "Refinement successfully!");
//
//    }


}
