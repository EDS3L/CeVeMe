package pl.ceveme.application.aop;

import pl.ceveme.domain.model.enums.EndpointType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckAiEndpointUsage {
    EndpointType value();
    boolean recordUsage() default true;
    String customName() default "";
}
