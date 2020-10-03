package com.stephen.iot.service;

import com.stephen.iot.data.common.VfData;
import com.stephen.iot.data.dto.CommonDTO;

import java.beans.IntrospectionException;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

public interface ReportRsService {
    File exportPdf(CommonDTO obj) throws IOException, IntrospectionException, InvocationTargetException, IllegalAccessException;
}
