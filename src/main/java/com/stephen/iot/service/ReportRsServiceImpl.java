package com.stephen.iot.service;

import com.stephen.iot.data.common.CommonUtil;
import com.stephen.iot.data.common.Constants;
import com.stephen.iot.data.common.VfData;
import com.stephen.iot.data.dto.CommonDTO;
import com.stephen.iot.dto.UserDto;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.export.*;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import org.hibernate.Session;
import org.hibernate.jdbc.Work;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Locale;

@Service
public class ReportRsServiceImpl implements ReportRsService {

    private JasperPrint jasperPrint = null;
    @Autowired
    HttpServletRequest request;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${temp_sub_folder_upload}")
    private String tempFileFolderUpload;

    @Autowired
    private VfData vfData;

    protected final Logger logger = LoggerFactory.getLogger(ReportRsServiceImpl.class);

    @Override
    public File exportPdf(CommonDTO obj) throws IOException, IntrospectionException, InvocationTargetException, IllegalAccessException {

        Session session = vfData.getSessionFactory().openSession();
        HashMap<String, Object> params = new HashMap<String, Object>();
        BeanInfo info = Introspector.getBeanInfo(obj.getClass());

        for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
            Method reader = pd.getReadMethod();
            if (reader != null) {
                params.put(pd.getName(), reader.invoke(obj));
            }
        }

        String reportName = obj.getReportName();

        String path = CommonUtil.getFilePath(folderUpload, tempFileFolderUpload);
        System.out.println(path);
        String prefix = makePrefix(reportName);
        File file = null;

        if ("PDF".equals(obj.getReportType())) {
            file = File.createTempFile(prefix, ".pdf", new File(path));
            generateReport(session, reportName, null, Constants.PDF_REPORT, params, file, "ABC");
        } else if ("EXCEL".equals(obj.getReportType())) {
            file = File.createTempFile(prefix, ".xlsx", new File(path));
            generateReport(session, reportName, null, Constants.EXCEL_REPORT, params, file, "ABC");
        } else {
            file = File.createTempFile(prefix, ".docx", new File(path));
            generateReport(session, reportName, null, Constants.DOC_REPORT, params, file, "ABC");
        }

        session.close();


        reportName = null;

        return file;
    }

    private String makePrefix(String name) {
        StringBuffer prefix = new StringBuffer();
        char[] nameArray = name.toCharArray();

        for (char ch : nameArray) {
            if (Character.isLetterOrDigit(ch)) {
                prefix.append(ch);
            } else {
                prefix.append("_");
            }
        }
        return prefix.toString();
    }


    private void generateReport(Session session, String reportName, String filePath, int reportType, HashMap params,
                                File file, String title) {
        session.doWork(new Work() {
            @Override
            @SuppressWarnings({"unchecked"})
            public void execute(Connection connection) throws SQLException {
                try {
                    jasperPrint = null;
                    ClassLoader classloader = Thread.currentThread().getContextClassLoader();
                    String reportPath = classloader.getResource("doc-template").getPath();
                    System.out.println(reportPath + " /" + reportName);
                    logger.info("reportPath:" + reportPath);
                    File fielRe = new File(reportPath + "/" + reportName + ".jasper");
                    InputStream reportStream = new FileInputStream(fielRe);
                    params.put("SUBREPORT_DIR", reportPath + "/");
                    params.put(JRParameter.REPORT_LOCALE, new Locale("vi", "VN"));
                    if (jasperPrint == null) {
                        UserDto objUser = (UserDto) request.getSession().getAttribute("userDto");
//                        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//                        if (objUser.getVpsUserInfo() != null && objUser.getVpsUserInfo().getSysGroupName() != null) {
//                            params.put("deptNameReq", objUser.getVpsUserInfo().getSysGroupName());
//                        }
                        // Begin fillReport
                        jasperPrint = JasperFillManager.fillReport(reportStream, params, connection);
                        // END fillReport
                        jasperPrint.setProperty("net.sf.jasperreports.export.xls.remove.empty.space.between.rows",
                                "true");
                    }

                    try {
                        connection.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    connection = null;

                    switch (reportType) {
                        case Constants.PDF_REPORT:
                            JRPdfExporter exporterpdf = new JRPdfExporter();
                            exporterpdf.setParameter(JRPdfExporterParameter.FORCE_LINEBREAK_POLICY, Boolean.FALSE);
                            // exporterpdf.setParameter(JRPdfExporterParameter.FORCE_SVG_SHAPES,
                            // Boolean.TRUE);
                            exporterpdf.setParameter(JRPdfExporterParameter.IS_COMPRESSED, Boolean.TRUE);
                            exporterpdf.setParameter(JRPdfExporterParameter.METADATA_TITLE, title);
                            exporterpdf.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
                            exporterpdf.setParameter(JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                            exporterpdf.setParameter(JRExporterParameter.OUTPUT_FILE, file);
                            exporterpdf.exportReport();
                            break;
                        case Constants.EXCEL_REPORT:
                            JRXlsxExporter exporterXLS = new JRXlsxExporter();
                            String[] sheetNames = {"Sheet1"};

                            // Trangdd - 2016/12/16: Remove header except first page
                            // when export to Excel
                            if (jasperPrint == null) {
                                jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.band.1",
                                        "pageHeader");
                                // Remove the pageFooter from all the pages
                                jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.band.2",
                                        "pageFooter");
                                // Remove the columnHeader from pages except starting page
                                jasperPrint.setProperty("net.sf.jasperreports.export.xls.exclude.origin.keep.first.band.1",
                                        "columnHeader");
                                jasperPrint.setProperty("net.sf.jasperreports.export.xls.remove.empty.space.between.rows",
                                        "true");
                                jasperPrint.setProperty(
                                        "net.sf.jasperreports.export.xls.remove.empty.space.between.columns", "true");
                            }

                            exporterXLS.setParameter(JRXlsAbstractExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS,
                                    Boolean.TRUE);
                            exporterXLS.setParameter(JRXlsAbstractExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
                            exporterXLS.setParameter(JRExporterParameter.OFFSET_X, 0);
                            exporterXLS.setParameter(JRExporterParameter.OFFSET_Y, 0);
                            exporterXLS.setParameter(JRXlsAbstractExporterParameter.IS_DETECT_CELL_TYPE, Boolean.TRUE);
                            exporterXLS.setParameter(JRXlsAbstractExporterParameter.IS_WHITE_PAGE_BACKGROUND,
                                    Boolean.FALSE);
                            exporterXLS.setParameter(JRXlsAbstractExporterParameter.SHEET_NAMES, sheetNames);
                            exporterXLS.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
                            exporterXLS.setParameter(JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                            exporterXLS.setParameter(JRExporterParameter.OUTPUT_FILE, file);
                            exporterXLS.exportReport();

                            break;
                        case Constants.HTML_REPORT:
                            // JasperExportManager.exportReportToHtmlFile(jasperPrint,
                            // filePath);

                            Integer limitedPages = 80;
                            JRXhtmlExporter exporter = new JRXhtmlExporter();

                            exporter.setParameter(JRHtmlExporterParameter.IS_OUTPUT_IMAGES_TO_DIR, Boolean.TRUE);
                            // trangdd Fix image not show in HTML issue
                            // exporter.setParameter(JRHtmlExporterParameter.IMAGES_DIR_NAME,
                            // Executions.getCurrent().getDesktop().getSession().getWebApp().getRealPath("/images/"));
                            // HttpServletRequest request =
                            // (HttpServletRequest)Executions.getCurrent().getNativeRequest();
                            // exporter.setParameter(JRHtmlExporterParameter.IMAGES_URI,
                            // request.getContextPath() + "/images/");
                            // trangdd
                            exporter.setParameter(JRHtmlExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS,
                                    Boolean.FALSE);
                            exporter.setParameter(JRHtmlExporterParameter.IS_USING_IMAGES_TO_ALIGN, Boolean.FALSE);
                            exporter.setParameter(JRHtmlExporterParameter.FRAMES_AS_NESTED_TABLES, Boolean.FALSE);
                            exporter.setParameter(JRHtmlExporterParameter.IS_WHITE_PAGE_BACKGROUND, Boolean.FALSE);
                            exporter.setParameter(JRHtmlExporterParameter.IS_WRAP_BREAK_WORD, Boolean.FALSE);
                            exporter.setParameter(JRPdfExporterParameter.IS_COMPRESSED, true);

                            // trangdd Neu bao cao co so page vuot qua page gioi han
                            // (do cau hinh) thi se hien thi so page gioi han
                            if (jasperPrint.getPages().size() > limitedPages && limitedPages > 1) {
                                exporter.setParameter(JRExporterParameter.END_PAGE_INDEX, limitedPages - 1);
                            }
                            // End trangdd
                            exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
                            exporter.setParameter(JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                            exporter.setParameter(JRExporterParameter.OUTPUT_FILE, file);
                            exporter.exportReport();

                            // System.out.println(" exportReport done ");
                            // this.bSign.setVisible(false);
                            break;
                        default:
                            JRDocxExporter exporterDoc = new JRDocxExporter();
                            exporterDoc.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
                            exporterDoc.setParameter(JRExporterParameter.CHARACTER_ENCODING, "utf-8");
                            exporterDoc.setParameter(JRExporterParameter.OUTPUT_FILE, file);
                            exporterDoc.exportReport();
                            break;
                    }

                } catch (JRException e1) {
                    e1.printStackTrace();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        });
    }
}
