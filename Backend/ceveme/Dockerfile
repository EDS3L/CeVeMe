FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build/ceveme

COPY build.gradle settings.gradle gradlew ./
COPY gradle/ gradle/
RUN ./gradlew dependencies --no-daemon

COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

RUN java -Djarmode=layertools \
    -jar build/libs/*.jar extract --destination target/extracted

FROM mcr.microsoft.com/playwright/java:v1.49.0-noble AS runtime
WORKDIR /app/ceveme

RUN apt-get update && apt-get install -y openjdk-21-jre && rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/ceveme/target/extracted/dependencies/ ./
COPY --from=builder /build/ceveme/target/extracted/spring-boot-loader/ ./
COPY --from=builder /build/ceveme/target/extracted/snapshot-dependencies/ ./
COPY --from=builder /build/ceveme/target/extracted/application/ ./

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-arm64

RUN useradd -m -u 10001 -s /sbin/nologin appuser && \
    chown -R appuser:appuser /app/ceveme

USER appuser

EXPOSE 8080

ENTRYPOINT ["java","org.springframework.boot.loader.launch.JarLauncher"]