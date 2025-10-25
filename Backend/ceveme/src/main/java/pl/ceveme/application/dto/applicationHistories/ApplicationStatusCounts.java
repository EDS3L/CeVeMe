package pl.ceveme.application.dto.applicationHistories;

public record ApplicationStatusCounts(int pending, int submitted, int rejected, int requested, int screening,
                                      int interview, int assignment, int offered, int accepted, int declined,
                                      int closed, int total) {
}
