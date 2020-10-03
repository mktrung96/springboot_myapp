package com.stephen.iot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stephen.iot.data.common.CustomJsonDateDeserializer;
import com.stephen.iot.data.common.CustomJsonDateSerializer;
import com.stephen.iot.model.DataIndicator;
import lombok.Data;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;
import java.util.List;

@Data
public class DataIndicatorDto extends BaseDto {
    private Integer dataIndicatorId;
    private Integer userId;
    private Integer updatedBy;
    private Integer areaId;
    private String areaCode;
    private String areaName;
    private Integer indicatorId;
    private String indicatorCode;
    private String indicatorName;
    private String content;
    private List<DataIndicatorDto> listChildDataIndicators;


//    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
//    @JsonSerialize(using = CustomJsonDateSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date date;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date dateFrom;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date dateTo;
    private String value;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date created;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Date updated;
    private String username;
    //    private String keySearch;
    private String unit;
    private Integer parentId;

    public DataIndicator toModel() {
        DataIndicator dataIndicatorBO = new DataIndicator();
        dataIndicatorBO.setDataIndicatorId(this.getDataIndicatorId());
        dataIndicatorBO.setAreaId(this.getAreaId());
        dataIndicatorBO.setIndicatorId(this.getIndicatorId());
        dataIndicatorBO.setUserId(this.getUserId());
        dataIndicatorBO.setValue(this.getValue());
        dataIndicatorBO.setDate(this.getDate());
        dataIndicatorBO.setContent(this.getContent());
        dataIndicatorBO.setCreated(this.getCreated());
        dataIndicatorBO.setUpdated(this.getUpdated());
        dataIndicatorBO.setUpdatedBy(this.getUpdatedBy());
        return dataIndicatorBO;
    }
}
