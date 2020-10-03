package com.stephen.iot.data.common;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BusinessException extends RuntimeException {

    private List<Object> listParam;

    public List<Object> getLstParam() {
        return listParam;
    }

    public void setLstParam(List<Object> listParam) {
        this.listParam = listParam;
    }

    public BusinessException(String arg0) {
        super(arg0);
    }

    public BusinessException(String arg0, Object... params) {
        super(arg0);
        listParam = new ArrayList<>();
        if (params != null) {
            listParam.addAll(Arrays.asList(params));
        }
    }
}
