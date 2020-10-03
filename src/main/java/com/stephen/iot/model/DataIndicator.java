package com.stephen.iot.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "data_indicator")
@Data
public class DataIndicator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "data_indicator_id")
    private Integer dataIndicatorId;
    @Column(name = "user_id")
    private Integer userId;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "area_id")
    private Integer areaId;
    @Column(name = "indicator_id")
    private Integer indicatorId;
    @Column(name = "date")
    private Date date;
    @Column(name = "value")
    private String value;
    @Column(name = "created")
    private Date created;
    @Column(name = "updated")
    private Date updated;
    @Column(name = "content")
    private String content;

}
