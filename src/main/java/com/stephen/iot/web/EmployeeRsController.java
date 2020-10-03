package com.stephen.iot.web;

import com.stephen.iot.data.common.Constants;
import com.stephen.iot.data.common.Response;

import com.stephen.iot.data.dto.DataListDTO;
import com.stephen.iot.data.dto.ErrorDto;
import com.stephen.iot.dto.UserDto;
import com.stephen.iot.service.SecurityService;
import com.stephen.iot.service.UserService;
import com.stephen.iot.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("/user")
public class EmployeeRsController {
    @Autowired
    private UserService userService;

    @Autowired
    HttpServletRequest request;
    @Autowired
    private SecurityService securityService;

    @Autowired
    private UserValidator userValidator;

    @PostMapping(path = "/getListEmployee")
    public @ResponseBody
    Response getListEmployee(@RequestBody UserDto obj) {
        List<UserDto> ls = userService.getListEmployee(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getTotalRecord());
        data.setStart(Integer.valueOf(1));
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);
    }

    @PostMapping(path = "/edit")
    public @ResponseBody
    Response edit(@RequestBody UserDto userDto) {
        boolean state = userService.edit(userDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(state);
    }

    @PostMapping(path = "/remove")
    public @ResponseBody
    Response remove(@RequestBody UserDto userDto) {
        boolean state = userService.remove(userDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS);
    }

    @PostMapping(path = "/save")
    public @ResponseBody
    Response save(@RequestBody UserDto userDto) {
        List<ErrorDto> ls = userValidator.customValidate(userDto.toModel());
        if (ls.size() > 0) {
            return Response.error(Constants.RESPONSE_CODE.ERROR).withData(ls.toString());
        }
        boolean flag = userService.saveEmployee(userDto);
        if (flag) {
            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
        }
        return Response.success(Constants.RESPONSE_CODE.ERROR);
    }

    @PostMapping(path = "/changePass")
    public @ResponseBody
    Response changePass(@RequestBody UserDto userDto) {
        try {
            boolean state = userService.changePass(userDto);
            return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(state);
        }catch (Exception e){
            return Response.success(Constants.RESPONSE_CODE.ERROR).withData(e.getMessage());
        }

    }

    @PostMapping(path = "/get_user")
    public @ResponseBody
    Response get_user(@RequestBody UserDto userDto) {
        UserDto obj = (UserDto) request.getSession().getAttribute("userDto");
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(obj);
    }

    @PostMapping(path = "/getUsersForAutoComplete")
    public @ResponseBody
    Response getUsersForAutoComplete(@RequestBody UserDto userDto) {
        List<UserDto> listUser = userService.getUsersForAutoComplete(userDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(listUser);
    }
}
