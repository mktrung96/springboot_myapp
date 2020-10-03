package com.stephen.iot.web;

import com.stephen.iot.data.common.Constants;
import com.stephen.iot.data.common.Response;
import com.stephen.iot.data.dto.DataListDTO;
import com.stephen.iot.dto.AreaDto;
import com.stephen.iot.dto.IndicatorDto;
import com.stephen.iot.model.Area;
import com.stephen.iot.service.AreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/area")
public class AreaRsController {
    @Autowired
    private AreaService areaService;

    @PostMapping(path = "/getListArea")
    public @ResponseBody
    Response getListArea(@RequestBody AreaDto obj) {
        List<AreaDto> listArea = areaService.getListArea(obj);
        DataListDTO data = new DataListDTO();
        data.setData(listArea);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getTotalRecord());
        data.setStart(Integer.valueOf(1));
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);
    }

    @PostMapping(path = "/save")
    public @ResponseBody
    Response save(@RequestBody AreaDto areaDto) {
        boolean flag = areaService.save(areaDto);
        if (flag){
            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
        }
        return Response.success(Constants.RESPONSE_CODE.ERROR);
    }

    @PostMapping(path = "/edit")
    public @ResponseBody
    Response edit(@RequestBody AreaDto areaDto) {
        boolean flag = areaService.edit(areaDto);
        if (flag){
            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
        }
        return Response.success(Constants.RESPONSE_CODE.ERROR);
    }

    @PostMapping(path = "/remove")
    public @ResponseBody
    Response remove(@RequestBody AreaDto areaDto) {
        boolean flag = areaService.remove(areaDto);
        if (flag){
            return Response.success(Constants.RESPONSE_CODE.SUCCESS);
        }
        return Response.success(Constants.RESPONSE_CODE.ERROR);
    }

    @PostMapping(path = "/getParentAreasForAutoComplete")
    public @ResponseBody
    Response getParentAreasForAutoComplete (@RequestBody AreaDto areaDto) {
        List<AreaDto> data = areaService.getParentAreasForAutoComplete(areaDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);
    }

    @PostMapping(path = "/getAreasForAutoComplete")
    public @ResponseBody
    Response getAreasForAutoComplete (@RequestBody AreaDto areaDto) {
        List<AreaDto> data = areaService.getAreasForAutoComplete(areaDto);
        return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(data);
    }

}
