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
@Table(name = "indicator")
@Data
public class Indicator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "indicator_id")
    private Integer indicatorId;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "issummary")
    private String isSummary;
    @Column(name = "parent_id")
    private Integer parentId;
    @Column(name = "datatype")
    private String datatype;
    @Column(name = "unit")
    private String unit;
    @Column(name = "seqno")
    private Integer seqNo;
    @Column(name = "isactive")
    private String isActive;
    @Column(name = "created")
    private Date created;
    @Column(name = "updated")
    private Date updated;

}
