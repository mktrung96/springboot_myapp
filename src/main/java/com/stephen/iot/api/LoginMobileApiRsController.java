package com.stephen.iot.api;

import com.stephen.iot.data.common.Constants;
import com.stephen.iot.data.common.Response;
import com.stephen.iot.dto.AreaDto;
import com.stephen.iot.dto.DataIndicatorDto;
import com.stephen.iot.dto.IndicatorDto;
import com.stephen.iot.dto.UserDto;
import com.stephen.iot.model.User;
import com.stephen.iot.payload.LoginRequest;
import com.stephen.iot.repository.UserRepository;
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
@RequestMapping("/service")
public class LoginMobileApiRsController {

    //    @Qualifier("ApiSecurityConfig")
    @Autowired
    AuthenticationManager authenticationManager;

    //    @Autowired
//    private JwtTokenProvider tokenProvider;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @Autowired
    private AreaService areaService;
    @Autowired
    private DataIndicatorService dataIndicatorService;
    @Autowired
    private IndicatorService indicatorService;

    @PostMapping("/login")
    public Response authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
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
            User user = userRepository.findByUsername(loginRequest.getUsername());
            UserDto userDto = new UserDto();
            userDto.setFullName(user.getUsername());
            userDto.setEmail(user.getEmail());
            userDto.setPhone(user.getPhone());
            userDto.setUserId(user.getId());
            userDto.setUsername(user.getUsername());
            userDto.setIsAdmin(user.getIsAdmin());
            userDto.setIsActive(user.getIsActive());
            // Trả về jwt cho người dùng.
//        CustomUserDetails temp = (CustomUserDetails) authentication.getPrincipal();
            return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(userDto);
        } catch (Exception e) {
            return Response.success(Constants.RESPONSE_CODE.ERROR);
        }

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

    @PostMapping(path = "/getListIndicator")
    public @ResponseBody
    Response getListIndicator(@RequestBody IndicatorDto indicatorDto) {
        List<IndicatorDto> listIndicator = indicatorService.getListIndicator(indicatorDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(listIndicator);
    }

    @PostMapping(path = "/getListDataForMobile")
    public @ResponseBody
    Response getListDataForMobile(@RequestBody DataIndicatorDto dataIndicatorDto) {
        List<DataIndicatorDto> listIndicator = dataIndicatorService.getListDataForMobile(dataIndicatorDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(listIndicator);
    }

//    @PostMapping(path = "/saveDataIndicator")
//    public @ResponseBody
//    Response save(@RequestBody DataIndicatorDto dataIndicatorDto) {
//        try {
//            dataIndicatorService.save(dataIndicatorDto);
//            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
//        } catch (Exception e){
//            return Response.success(Constants.RESPONSE_CODE.ERROR);
//        }
//    }
//
//
    @PostMapping(path = "/editDataIndicator")
    public @ResponseBody
    Response edit(@RequestBody DataIndicatorDto obj) {
        try {
            dataIndicatorService.edit(obj);
            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
        } catch (Exception e){
            return Response.success(Constants.RESPONSE_CODE.ERROR);
        }
    }

//    @PostMapping(path = "/updateDailyData")
//    public @ResponseBody
//    Response updateDailyData(@RequestBody DataIndicatorDto dataIndicatorDto) {
//        try {
//            dataIndicatorService.updateDailyData(dataIndicatorDto);
//            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
//        } catch (Exception e){
//            return Response.success(Constants.RESPONSE_CODE.ERROR);
//        }
//    }

//    @PostMapping(path = "/removeDataIndicator")
//    public @ResponseBody
//    Response remove(@RequestBody DataIndicatorDto dataIndicatorDto) {
//        boolean flag = dataIndicatorService.remove(dataIndicatorDto);
//        if (flag) {
//            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
//        }
//        return Response.success(Constants.RESPONSE_CODE.ERROR);
//    }

}
