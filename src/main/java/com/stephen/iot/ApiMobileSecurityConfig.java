//package com.stephen.iot;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.annotation.Order;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//
//@Configuration
//@EnableWebSecurity
//@Order(1)
//public class ApiMobileSecurityConfig extends WebSecurityConfigurerAdapter {
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//                .cors()
//                .and()
//                .antMatcher("/service/**")
//                .csrf().disable()
//                .authorizeRequests()
//                .antMatchers("/service/login").permitAll(); // Cho phép tất cả mọi người truy cập vào 2 địa chỉ này
//    }
//}
