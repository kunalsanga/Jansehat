    package com.sih.telemed.telemedbackend;

    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    import org.springframework.boot.autoconfigure.domain.EntityScan;
    import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

    @EntityScan("com.sih.telemed.telemedbackend.model")
    @EnableJpaRepositories("com.sih.telemed.telemedbackend.Repository")
    @SpringBootApplication
    public class TelemedBackendApplication {

        public static void main(String[] args) {
            SpringApplication.run(TelemedBackendApplication.class, args);
        }

    }
