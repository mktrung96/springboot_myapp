package com.stephen.iot.data.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CommonDTO {
    private String reportName;
    private String reportType;
    private Integer userId;
    private Integer indicatorId;
    private Integer areaId;
    private Date dateFrom;
    private Date dateTo;
}
