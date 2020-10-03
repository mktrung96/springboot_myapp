package com.stephen.iot.data.dto;

import lombok.Data;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.List;

@XmlRootElement(
        name = "data"
)
@Data
public class DataListDTO implements Serializable {
    private Integer start;
    private Integer size;
    private Integer total;
    private List data;
}
