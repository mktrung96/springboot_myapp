package com.stephen.iot.service;

import com.stephen.iot.data.dto.CustomUserDetails;
import com.stephen.iot.dto.UserDto;
import com.stephen.iot.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.Principal;

@Component
public class AuthenticationSuccessHandlerImpl implements AuthenticationSuccessHandler {

    @Autowired
    HttpSession session; //autowiring session

    @Autowired
    UserRepository repository; //autowire the user repo
    @Autowired
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationSuccessHandlerImpl.class);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        // TODO Auto-generated method stub
        UserDto userDto;

        String userName = "";
        if (authentication.getPrincipal() instanceof Principal) {
            userName = ((Principal) authentication.getPrincipal()).getName();

        } else {
            userName = ((CustomUserDetails) authentication.getPrincipal()).getUsername();
        }
        logger.info("userName: " + userName);
        userDto = userService.getUserInfoByUserName(userName);

        //HttpSession session = request.getSession();
//        session.setAttribute("userId", userName);
        session.setAttribute("userDto", userDto);
        response.sendRedirect("/index" );
    }

}
