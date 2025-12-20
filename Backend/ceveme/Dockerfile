FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build/ceveme

COPY build.gradle settings.gradle gradlew ./
COPY gradle/ gradle/
RUN ./gradlew dependencies --no-daemon

COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

RUN java -Djarmode=layertools \
    -jar build/libs/*.jar extract --destination target/extracted

FROM mcr.microsoft.com/playwright/java:v1.56.0-noble AS runtime
WORKDIR /app/ceveme

RUN apt-get update && apt-get install -y openjdk-21-jre && \
    rm -rf /var/lib/apt/lists/*

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY --from=builder /build/ceveme/target/extracted/dependencies/ ./
COPY --from=builder /build/ceveme/target/extracted/spring-boot-loader/ ./
COPY --from=builder /build/ceveme/target/extracted/snapshot-dependencies/ ./
COPY --from=builder /build/ceveme/target/extracted/application/ ./

# Tworzenie użytkownika i uprawnienia
RUN useradd -m -u 10001 appuser && \
    chown -R appuser:appuser /app/ceveme && \
    mkdir -p /tmp/playwright && chown -R appuser:appuser /tmp/playwright

USER appuser

EXPOSE 8080

ENTRYPOINT ["java","org.springframework.boot.loader.launch.JarLauncher"]