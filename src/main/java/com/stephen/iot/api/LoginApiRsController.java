package com.stephen.iot.api;

import com.stephen.iot.data.common.Constants;
import com.stephen.iot.data.common.Response;
import com.stephen.iot.data.dto.CustomUserDetails;
import com.stephen.iot.dto.AreaDto;
import com.stephen.iot.dto.DataIndicatorDto;
import com.stephen.iot.dto.IndicatorDto;
import com.stephen.iot.dto.UserDto;
import com.stephen.iot.jwt.JwtTokenProvider;
import com.stephen.iot.payload.LoginRequest;
import com.stephen.iot.payload.LoginResponse;
import com.stephen.iot.service.AreaService;
import com.stephen.iot.service.DataIndicatorService;
import com.stephen.iot.service.IndicatorService;
import com.stephen.iot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

/**
 * Copyright 2019 {@author Loda} (https://loda.me).
 * This project is licensed under the MIT license.
 *
 * @since 5/1/2019
 * Github: https://github.com/loda-kun
 */
@RestController
@RequestMapping("/abc")
public class LoginApiRsController {

    //    @Qualifier("ApiSecurityConfig")
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private AreaService areaService;
    @Autowired
    private DataIndicatorService dataIndicatorService;
    @Autowired
    private IndicatorService indicatorService;

    @PostMapping("/login")
    public LoginResponse authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Xác thực thông tin người dùng Request lên
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // Nếu không xảy ra exception tức là thông tin hợp lệ
        // Set thông tin authentication vào Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Trả về jwt cho người dùng.
        CustomUserDetails temp = (CustomUserDetails) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(temp);
        return new LoginResponse(jwt);
    }

    @PostMapping(path = "/getListEmployee")
    public @ResponseBody
    Response getListEmployee(@RequestBody UserDto userDto) {
        List<UserDto> listUser = userService.getListEmployee(userDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(listUser);
    }

    @PostMapping(path = "/getListArea")
    public @ResponseBody
    Response getListArea(@RequestBody AreaDto areaDto) {
        List<AreaDto> listArea = areaService.getListArea(areaDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(listArea);
    }

    @PostMapping(path = "/getListDataIndicator")
    public @ResponseBody
    Response getListDataIndicator(@RequestBody DataIndicatorDto dataIndicatorDto) {
        List<DataIndicatorDto> listIndicator = dataIndicatorService.getListDataIndicator(dataIndicatorDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(listIndicator);
    }

    @PostMapping(path = "/getListIndicator")
    public @ResponseBody
    Response getListIndicator(@RequestBody IndicatorDto indicatorDto) {
        List<IndicatorDto> listIndicator = indicatorService.getListIndicator(indicatorDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(listIndicator);
    }
}
