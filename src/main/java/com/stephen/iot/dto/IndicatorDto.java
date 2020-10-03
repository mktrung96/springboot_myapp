package com.stephen.iot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stephen.iot.data.common.CustomJsonDateDeserializer;
import com.stephen.iot.data.common.CustomJsonDateSerializer;
import com.stephen.iot.model.Area;
import com.stephen.iot.model.Indicator;
import lombok.Data;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;

@Data
public class IndicatorDto extends BaseDto{
    private Integer indicatorId;
    private String code;
    private String name;
    private String isSummary;
    private Integer parentId;
    private String parentCode;
    private String parentName;
    private String dataType;
    private String unit;
    private Integer seqNo;
    private String isActive;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date created;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date updated;

    private String keySearch;
    private String indicatorCode;
    private String indicatorName;

    public Indicator toModel() {
        Indicator indicatorBO = new Indicator();
        indicatorBO.setIndicatorId(this.getIndicatorId());
        indicatorBO.setCode(this.getCode());
        indicatorBO.setName(this.getName());
        indicatorBO.setIsSummary(this.getIsSummary());
        indicatorBO.setParentId(this.getParentId());
        indicatorBO.setUnit(this.getUnit());
        indicatorBO.setDatatype(this.getDataType());
        indicatorBO.setSeqNo(this.getSeqNo());
        indicatorBO.setIsActive(this.getIsActive());
        indicatorBO.setCreated(this.getCreated());
        indicatorBO.setUpdated(this.getUpdated());
        return indicatorBO;
    }

}
