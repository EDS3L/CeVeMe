FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build/ceveme

COPY build.gradle settings.gradle gradlew ./
COPY gradle/ gradle/
RUN ./gradlew dependencies --no-daemon

COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

RUN java -Djarmode=layertools \
    -jar build/libs/*.jar extract --destination target/extracted

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app/ceveme

RUN adduser -D -H -u 10001 -s /sbin/nologin appuser

COPY --from=builder /build/ceveme/target/extracted/dependencies/ ./
COPY --from=builder /build/ceveme/target/extracted/spring-boot-loader/ ./
COPY --from=builder /build/ceveme/target/extracted/snapshot-dependencies/ ./
COPY --from=builder /build/ceveme/target/extracted/application/ ./

RUN chown -R appuser:appuser .

USER appuser

EXPOSE 8080

ENTRYPOINT ["java","org.springframework.boot.loader.launch.JarLauncher"]