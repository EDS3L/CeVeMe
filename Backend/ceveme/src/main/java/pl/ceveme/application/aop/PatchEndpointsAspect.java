package pl.ceveme.application.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PatchEndpointsAspect {

    @Pointcut("@annotation(org.springframework.web.bind.annotation.PatchMapping)")
    public void anyPatchMapping() {}


    @Before("anyPatchMapping()")
    public void beforePatchMapped(JoinPoint jp) {
        checkRequest();
    }


    public void checkRequest() {
        System.out.println("PATCH METHOD!");
    }
}
