package com.stephen.iot;

import com.stephen.iot.jwt.JwtAuthenticationFilter;
import com.stephen.iot.service.ApiUserDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private ApiUserDetailServiceImpl userDetailsService;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        // Get AuthenticationManager Bean
        return super.authenticationManagerBean();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

//    @Override
//    protected void configureGlobal(AuthenticationManagerBuilder auth)
//            throws Exception {
//        auth.userDetailsService(userDetailsService) // Cung cáp userservice cho spring security
//                .passwordEncoder(passwordEncoder()); // cung cấp password encoder
//    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .antMatcher("/api/**")
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/login").permitAll() // Cho phép tất cả mọi người truy cập vào 2 địa chỉ này
                .anyRequest().authenticated(); // Tất cả các request khác đều cần phải xác thực mới được truy cập

        // Thêm một lớp Filter kiểm tra jwt
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    }
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//                .cors()
//                    .and()
//                .antMatcher("/api/**")
//                .csrf().disable()
//                .authorizeRequests()
//                    .anyRequest().authenticated().and()
//                .addFilterBefore(rememberMeAuthenticationFilter(), BasicAuthenticationFilter.class)
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
//                .exceptionHandling().authenticationEntryPoint(new Http403ForbiddenEntryPoint());
//        // Thêm một lớp Filter kiểm tra jwt
//        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
//    }
//
//    /**
//     * Remember me config
//     */
////    @Override
//    protected void registerAuthentication(AuthenticationManagerBuilder auth) throws Exception {
//        auth.authenticationProvider(rememberMeAuthenticationProvider());
//    }
//
//    @Bean
//    public RememberMeAuthenticationFilter rememberMeAuthenticationFilter() throws Exception {
//        return new RememberMeAuthenticationFilter(authenticationManager(), tokenBasedRememberMeService());
//    }
//
//    @Bean
//    public CustomTokenBasedRememberMeService tokenBasedRememberMeService() {
//        CustomTokenBasedRememberMeService service = new CustomTokenBasedRememberMeService(tokenKey, userDetailsServiceImpl);
//        service.setAlwaysRemember(true);
//        service.setCookieName("at");
//        return service;
//    }
//
//    @Bean
//    RememberMeAuthenticationProvider rememberMeAuthenticationProvider() {
//        return new RememberMeAuthenticationProvider(tokenKey);
//    }
}
