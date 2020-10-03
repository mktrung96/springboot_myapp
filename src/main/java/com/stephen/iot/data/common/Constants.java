/*
 * Copyright (C) 2018 Viettel Telecom. All rights reserved. VIETTEL PROPRIETARY/CONFIDENTIAL. Use is
 * subject to license terms.
 */
package com.stephen.iot.data.common;

import javax.servlet.http.HttpServletRequest;


/**
 * @author d2tsoftware
 * @version 1.0
 * @since Nov 20, 2018
 */
public class Constants {
    /**
     * RESPONSE_TYPE
     *
     * @author d2tsoftware
     * @version 1.0
     * @since Nov 27, 2018
     */
    private static HttpServletRequest req;
    public static String SCHEMA_BAITOANSO1 = "baitoanso1";

    public static final int DOC_REPORT = 0;
    public static final int PDF_REPORT = 1;
    public static final int EXCEL_REPORT = 2;
    public static final int HTML_REPORT = 3;

    public static class RESPONSE_TYPE {
        public static final String SUCCESS = "SUCCESS";
        public static final String ERROR = "ERROR";
        public static final String WARNING = "WARNING";
        public static final String CONFIRM = "CONFIRM";
        public static final String invalidPermission = "invalidPermission";
    }

    /**
     * RESPONSE_TYPE
     *
     * @author d2tsoftware
     * @version 1.0
     * @since Nov 27, 2018
     */
    public static class RESPONSE_CODE {
        public static final String SUCCESS = "success";
        public static final String DELETE_SUCCESS = "deleteSuccess";
        public static final String UPDATE_STATUS_SUCCESS = "updateStatusSuccess";
        public static final String UPDATE_SUCCESS = "updateSuccess";
        public static final String ERROR = "error";
        public static final String WARNING = "warning";
        public static final String NO_CONTENT = "No Content";
        public static final String RECORD_DELETED = "record.deleted";
        public static final String EMAIL_ADDRESS_DELETED = "emailAddress.deleted";
        public static final String RECORD_INUSED = "record.inUsed";
        public static final String RECORD_NOT_EXISTED = "recordNotExits";
        public static final String POSITION_EXISTED = "positionExits";
        public static final String POSITION_WAGE_EXISTED = "positionWageExits";
        public static final String DOCUMENT_TYPE_EXISTED = "documentTypeExits";
        public static final String NOT_ALLOWED_ADD_EMPLOYEE = "employee.notAllowedAddEmployee";
        public static final String NOT_ALLOWED_DELETE_EMPLOYEE = "employee.notAllowedDeleteEmployee";
        public static final String DUPICATE_DATA_REDUCTION = "taxReduction.duplicateData";
        public static final String PARAMETER_USED = "parameterUsed";
        public static final String SYS_CAT_TYPE_USED = "sysCatTypeUsed";
        public static final String ORG_DUPLICATE_CODE = "organization.duplicateCode";
        public static final String ORG_DUPLICATE_NAME = "organization.duplicateName";
        public static final String NATION_CONFIG_TYPE_USED = "nationConfigTypeUsed";
        public static final String EMP_WORK_SCHEDULE_SUCCESS = "empWorkSchedule.success";
        public static final String NOT_ALLOWED_DELETE_DATA_TYPE = "dataType.recordInUsed";
        public static final String NOT_ALLOWED_DELETE_FORMULA = "formula.config.cannotDelete";
        public static final String NOT_ALLOWED_CHANGE_STATUS_FORMULA = "formula.config.cannotChange";
        public static final String NOT_ALLOWED_EVALUATION = "evaluation.cannotEvaluation";
        public static final String NO_RECORDS = "evaluation.noRecords";
        public static final String LOCK_UNIT = "evaluation.orglocked";
        public static final String NO_DATA_EVALUATION = "evaluation.noData";
        public static final String ROLE_EXIST = "permission.role.exist";
        public static final String MENU_HAVE_CHILD = "permission.menu.haveChild";
        public static final String ERROR_COMPOSITE = "error.composite";
        public static final String SUCCESS_COMPOSITE = "success.composite";
        public static final String ERROR_SEND = "error.send";
        public static final String SUCCESS_SEND = "success.send";
        public static final String SUCCESS_SAVE = "success.save";
        public static final String DELETE_ERROR = "error.delete";
        public static final String SAVE_DUPLICATECODE = "save.duplicateCode";
        public static final String DOMAIN_DUPLICATECODE = "permission.duplicateDomain";
        public static final String EMP_CODE_DUPLICATECODE = "empCodeConfig.duplicatePrefixCode";

    }
}
