package com.stephen.iot.web;

import com.stephen.iot.data.dto.CommonDTO;
import com.stephen.iot.service.ReportRsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.beans.IntrospectionException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

@Controller
@RequestMapping("/reportServiceRest")
public class ReportRsController {

    @Autowired
    ReportRsService reportRsService;

//    @PostMapping(path = "/exportPdf")
//    public @ResponseBody
//    Response exportPdf(@RequestBody CommonDTO obj) {
//        try {
//            File file = reportRsService.exportPdf(obj);
//            if (file.exists()) {
//
//            return Response.success(Constants.RESPONSE_CODE.SUCCESS).withData(file);
//            }
//            return Response.warning(Constants.RESPONSE_CODE.NO_CONTENT);
//        } catch (Exception e) {
////        session.close();
//            return Response.warning(Constants.RESPONSE_CODE.NO_CONTENT);
//        }
//
//    }

    @PostMapping(path = "/exportPdf")
    public @ResponseBody
    ResponseEntity<Resource> exportPdf(@RequestBody CommonDTO obj) throws IOException, IllegalAccessException, IntrospectionException, InvocationTargetException {

        File file = reportRsService.exportPdf(obj);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }


}
