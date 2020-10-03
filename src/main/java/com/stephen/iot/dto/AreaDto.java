package com.stephen.iot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stephen.iot.model.Area;
import lombok.Data;

import java.util.Date;

@Data
public class AreaDto extends BaseDto {

    private Integer areaId;
    private String name;
    private String code;

    private String isSummary;
    private Integer parentId;
    private String parentCode;
    private String parentName;
    private String isActive;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date created;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date updated;
    private String keySearch;
    private String areaCode;
    private String areaName;

    public Area toModel() {
        Area areaBO = new Area();
        areaBO.setAreaId(this.getAreaId());
        areaBO.setCode(this.getCode());
        areaBO.setName(this.getName());
        areaBO.setIsSummary(this.getIsSummary());
        areaBO.setParentId(this.getParentId());
        areaBO.setIsActive(this.getIsActive());
        areaBO.setCreated(this.getCreated());
        areaBO.setUpdated(this.getUpdated());
        return areaBO;
    }
}
