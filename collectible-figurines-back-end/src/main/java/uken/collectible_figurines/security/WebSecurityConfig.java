package uken.collectible_figurines.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  public WebSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
  }
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
      "http://localhost:4200",
      "https://collectiblefigurines.pl"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE", "OPTIONS"));

    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    httpSecurity
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))//.cors(AbstractHttpConfigurer::disable)
      .csrf(AbstractHttpConfigurer::disable)
      .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
    .authorizeHttpRequests(auth -> auth
      .requestMatchers(
        "/api/users/login",
        "/api/users/register",
        "/api/figurines/all",
        "api/fandoms/all",
        "api/figurines/count/**",
        "api/images/**"
//        "/swagger-ui/**",
//        "/v3/api-docs/**",
//        "/swagger-ui.html"
      ).permitAll()
      .requestMatchers(
        "/api/users/all",
        "/api/users/total",
        "/api/users/active",
        "/api/figurines/all",
        "/api/figurines/add",
        "/api/figurines/edit/**",
        "/api/figurines/delete/**",
        "/api/fandoms/all",
        "/api/fandoms/add",
        "/api/fandoms/edit/**",
        "/api/fandoms/delete/**"
      ).hasAuthority("ADMIN")
      .anyRequest().authenticated()
    )
    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return httpSecurity.build();
  }

}
