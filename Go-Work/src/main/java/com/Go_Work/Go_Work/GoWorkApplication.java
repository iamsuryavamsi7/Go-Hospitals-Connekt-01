package com.Go_Work.Go_Work;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GoWorkApplication {

	public static void main(String[] args) {

		SpringApplication.run(GoWorkApplication.class, args);

		System.out.println("\n\n\nGo Work Backend is fine...\n\n\n");

	}

}
