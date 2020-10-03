package com.stephen.iot.api;

import com.stephen.iot.data.common.Constants;
import com.stephen.iot.data.common.Response;
import com.stephen.iot.dto.IndicatorDto;
import com.stephen.iot.service.AreaService;
import com.stephen.iot.service.DataIndicatorService;
import com.stephen.iot.service.IndicatorService;
import com.stephen.iot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/service")
public class IndicatorMobileApiRsController {

    @Autowired
    AuthenticationManager authenticationManager;


    @Autowired
    private UserService userService;

    @Autowired
    private AreaService areaService;
    @Autowired
    private DataIndicatorService dataIndicatorService;
    @Autowired
    private IndicatorService indicatorService;

    @PostMapping(path = "/getIndicatorsForApiAdd")
    public @ResponseBody
    Response getIndicatorsForApiAdd(@RequestBody IndicatorDto indicatorDto) {
        try {
            List<IndicatorDto> data = indicatorService.getIndicatorsForApiAdd(indicatorDto);
            return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);
        }catch (Exception e){
            return Response.success(Constants.RESPONSE_CODE.ERROR);
        }

    }
}
