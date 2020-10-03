package com.stephen.iot.web;

import com.stephen.iot.data.common.Constants;
import com.stephen.iot.data.common.Response;
import com.stephen.iot.data.dto.DataListDTO;
import com.stephen.iot.dto.AreaDto;
import com.stephen.iot.dto.IndicatorDto;
import com.stephen.iot.dto.UserDto;
import com.stephen.iot.model.Area;
import com.stephen.iot.service.IndicatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.persistence.Query;
import java.util.List;

@Controller
@RequestMapping("/indicator")
public class IndicatorRsController {
    @Autowired
    private IndicatorService indicatorService;

    @PostMapping(path = "/getListIndicator")
    public @ResponseBody
    Response getListIndicator(@RequestBody IndicatorDto obj) {
        List<IndicatorDto> ls = indicatorService.getListIndicator(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getTotalRecord());
        data.setStart(Integer.valueOf(1));
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);
    }

    @PostMapping(path = "/save")
    public @ResponseBody
    Response save(@RequestBody IndicatorDto indicatorDto) {
        boolean flag = indicatorService.save(indicatorDto);
        if (flag){
            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
        }
        return Response.success(Constants.RESPONSE_CODE.ERROR);
    }

    @PostMapping(path = "/edit")
    public @ResponseBody
    Response edit(@RequestBody IndicatorDto indicatorDto) {
        boolean flag = indicatorService.edit(indicatorDto);
        if (flag){
            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
        }
        return Response.success(Constants.RESPONSE_CODE.ERROR);
    }

    @PostMapping(path = "/remove")
    public @ResponseBody
    Response remove(@RequestBody IndicatorDto indicatorDto) {
        boolean flag = indicatorService.remove(indicatorDto);
        if (flag){
            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
        }
        return Response.success(Constants.RESPONSE_CODE.ERROR);
    }

    @PostMapping(path = "/getParentIndicatorsForAutoComplete")
    public @ResponseBody
    Response getParentIndicatorsForAutoComplete (@RequestBody IndicatorDto indicatorDto) {
        List<IndicatorDto> data = indicatorService.getParentIndicatorsForAutoComplete(indicatorDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);
    }

    @PostMapping(path = "/getIndicatorsForAutoComplete")
    public @ResponseBody
    Response getIndicatorsForAutoComplete (@RequestBody IndicatorDto indicatorDto) {
        List<IndicatorDto> data = indicatorService.getIndicatorsForAutoComplete(indicatorDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);
    }
}
