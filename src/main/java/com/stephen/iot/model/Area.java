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
@Table(name = "area" , schema = "baitoanso1")
@Data
public class Area {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "area_id")
    private Integer  areaId;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "issummary")
    private String isSummary;
    @Column(name = "parent_id")
    private Integer parentId;
    @Column(name = "isactive")
    private String isActive;
    @Column(name = "created")
    private Date created;
    @Column(name = "updated")
    private Date updated;

}
