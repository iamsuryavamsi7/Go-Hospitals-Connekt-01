package com.Go_Work.Go_Work.Config;

import com.Go_Work.Go_Work.Service.LogoutService;
import com.Go_Work.Go_Work.Service.MyUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Properties;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableAsync
public class SecurityConfig {

    private final MyUserDetailsService myUserDetailsService;

    private final JwtFilterChain jwtFilterChain;

    private final LogoutService logoutService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(
                        cors -> cors.configurationSource(corsConfigurationSource())
                )
                .csrf(
                        customizer -> customizer.disable()
                )
                .authorizeHttpRequests(
                        request -> request
                                .requestMatchers("/api/v1/auth/**")
                                .permitAll()
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilterChain, UsernamePasswordAuthenticationFilter.class)
                .logout(
                        logout -> logout
                                .logoutUrl("/api/v1/logout")
                                .addLogoutHandler(logoutService)
                                .logoutSuccessHandler(
                                        (request, response, authentication) -> SecurityContextHolder.clearContext()
                                )
                );

        return http.build();

    }

    @Bean
    public AuthenticationProvider authenticationProvider(){

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        provider.setPasswordEncoder(passwordEncoder());

        provider.setUserDetailsService(myUserDetailsService);

        return provider;

    }

    @Bean
    public PasswordEncoder passwordEncoder(){

        return new BCryptPasswordEncoder(12);

    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true); // Allows credentials (cookies, authorization headers, etc.)

        // Add dynamic origins or IPs, you can use patterns or add multiple specific origins
        configuration.addAllowedOriginPattern("http://work.gohospitals.in:*");

        configuration.addAllowedHeader("*"); // Allow all headers
        configuration.addAllowedMethod("*"); // Allow all methods (GET, POST, etc.)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all paths
        return source;
    }

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername("iamsuryavamsi@gmail.com");
        mailSender.setPassword("kqsc rbye uhzk zrjd"); // App-specific password

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.debug", "true");

        return mailSender;
    }

}
