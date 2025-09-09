package pl.ceveme.application.dto.user;

public record UserLimitResponse(Integer cvDailyLimit, Integer cvMonthlyLimit, Integer refinementDailyLimit,
                                Integer refinementMonthlyLimit, Integer userCvDailyLimit, Integer userCvMonthlyLimit,
                                Integer userRefinementDailyLimit, Integer userRefinementMonthlyLimit, String message) {
}
