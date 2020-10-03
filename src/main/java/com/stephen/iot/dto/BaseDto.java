package com.stephen.iot.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class BaseDto implements Serializable {
    private Integer page;
    private Integer pageSize;
    private Integer totalRecord;

}
