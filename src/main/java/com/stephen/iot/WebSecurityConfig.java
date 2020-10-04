//package com.stephen.iot;
//
//import com.stephen.iot.service.AuthenticationSuccessHandlerImpl;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.annotation.Order;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//@Configuration
//@EnableWebSecurity
//@Order(3)
//public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
//    @Qualifier("userDetailsServiceImpl")
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//    @Bean
//    public BCryptPasswordEncoder bCryptPasswordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Autowired
//    AuthenticationSuccessHandlerImpl authenticationSuccessHandler;
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//            .csrf().disable()
//            .authorizeRequests()
//                .antMatchers("/resources/**", "/registration").permitAll()// Cho phép tất cả mọi người truy cập vào 2 địa chỉ này
//                .anyRequest().authenticated()// Tất cả các request khác đều cần phải xác thực mới được truy cập
//                .and()
//            .formLogin()// Cho phép người dùng xác thực bằng form login
//                .loginPage("/login")
//                .permitAll().successHandler(authenticationSuccessHandler)// Tất cả đều được truy cập vào địa chỉ này
//                .and()
//            .logout()
//                .permitAll();
//    }
//
//    @Bean
//    public AuthenticationManager customAuthenticationManager() throws Exception {
//        return authenticationManager();
//    }
//
//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
//    }
//}
