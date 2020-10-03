package com.stephen.iot.web;

import com.stephen.iot.data.common.Constants;
import com.stephen.iot.data.common.Response;
import com.stephen.iot.data.dto.DataListDTO;
import com.stephen.iot.dto.DataIndicatorDto;
import com.stephen.iot.service.DataIndicatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/dataIndicator")
public class DataIndicatorRsController {
    @Autowired
    private DataIndicatorService dataIndicatorService;

    @PostMapping(path = "/getListDataIndicator")
    public @ResponseBody
    Response getListDataIndicator(@RequestBody DataIndicatorDto obj) {
        List<DataIndicatorDto> ls = dataIndicatorService.getListDataIndicator(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getTotalRecord());
        data.setStart(Integer.valueOf(1));
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);

    }

//    @PostMapping(path = "/edit")
//    public @ResponseBody
//    Response edit(@RequestBody DataIndicatorDto dataIndicatorDto) {
//        boolean flag = dataIndicatorService.edit(dataIndicatorDto);
//        if (flag) {
//            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
//        }
//        return Response.success(Constants.RESPONSE_CODE.ERROR);
//    }

//    @PostMapping(path = "/remove")
//    public @ResponseBody
//    Response remove(@RequestBody DataIndicatorDto dataIndicatorDto) {
//        try {
//            dataIndicatorService.remove(dataIndicatorDto);
//            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
//        } catch (Exception e) {
//            return Response.success(Constants.RESPONSE_CODE.ERROR);
//        }
//    }
}
