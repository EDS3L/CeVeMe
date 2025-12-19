package pl.ceveme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CevemeApplication {

	public static void main(String[] args) {
		SpringApplication.run(CevemeApplication.class, args);
	}

}
