package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomDebt;
import ecma.demo.storeapplication.custom.CustomProductRemain;
import ecma.demo.storeapplication.custom.CustomShoppingDeliver;
import ecma.demo.storeapplication.custom.CustomShoppingHistory;
import ecma.demo.storeapplication.entity.Client;
import ecma.demo.storeapplication.repository.DeliverRepository;
import org.apache.commons.compress.utils.IOUtils;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFPicture;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.util.NumberToTextConverter;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.Raster;
import java.io.*;
import java.net.URL;
import java.util.List;


@Service
public class ExcelExporter {

    @Autowired
    DeliverRepository deliverRepository;

    public ByteArrayInputStream exportProductsToExcel(List<CustomProductRemain> products) {


        try {
            Workbook workbook = new XSSFWorkbook();

            Sheet sheet = workbook.createSheet("Ombordagi qoldiq");

            Row row = sheet.createRow(0);

            Font headerFont = workbook.createFont();
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            cellStyle.setFont(headerFont);

            Cell cell = row.createCell(0);
            cell.setCellValue("Mahsulot nomi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(1);
            cell.setCellValue("Mahsulot nomiEn");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(2);
            cell.setCellValue("Kod");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(3);
            cell.setCellValue("Miqdori");
            cell.setCellStyle(cellStyle);


//            cell = row.createCell(4);
//            cell.setCellValue("Yuan narxi");
//            cell.setCellStyle(cellStyle);

//            cell = row.createCell(4);
//            cell.setCellValue("Kelib tushish narxi");
//            cell.setCellStyle(cellStyle);
//
//            cell = row.createCell(5);
//            cell.setCellValue("Kelib tushish narxi boyicha summa");
//            cell.setCellStyle(cellStyle);
//
//            cell = row.createCell(6);
//            cell.setCellValue("Tan narxi");
//            cell.setCellStyle(cellStyle);
//
//            cell = row.createCell(8);
//            cell.setCellValue("Yo'lkira narxi");
//            cell.setCellStyle(cellStyle);

//            cell = row.createCell(9);
//            cell.setCellValue("Bojxona narxi");
//            cell.setCellStyle(cellStyle);

//            cell = row.createCell(10);
//            cell.setCellValue("Boshqa xarajatlar");
//            cell.setCellStyle(cellStyle);

            cell = row.createCell(4);
            cell.setCellValue("Chakana narxi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(5);
            cell.setCellValue("Ulgurji narxi");
            cell.setCellStyle(cellStyle);

            for (int i = 0; i < products.size(); i++) {
                Row row1 = sheet.createRow(i + 1);
                row1.createCell(0).setCellValue(products.get(i).getUz_name());
                row1.createCell(1).setCellValue(products.get(i).getEn_name());
                row1.createCell(2).setCellValue(products.get(i).getCode());
                row1.createCell(3).setCellValue(NumberToTextConverter.toText(products.get(i).getAmount()));
//                row1.createCell(4).setCellValue(products.get(i).getJuan());
//                row1.createCell(4).setCellValue(NumberToTextConverter.toText(products.get(i).getEnding_price()) + " " + products.get(i).getCurrency());
//                row1.createCell(5).setCellValue(NumberToTextConverter.toText(products.get(i).getAmount_ending_price()) + " " + products.get(i).getCurrency());
//                row1.createCell(6).setCellValue(NumberToTextConverter.toText(products.get(i).getPrice()) + " " + products.get(i).getCurrency());
//                row1.createCell(8).setCellValue(NumberToTextConverter.toText(products.get(i).getFare_cost()) + " " + products.get(i).getCurrency());
//                row1.createCell(9).setCellValue(NumberToTextConverter.toText(products.get(i).getCustom_cost()) + " " + products.get(i).getCurrency());
//                row1.createCell(10).setCellValue(NumberToTextConverter.toText(products.get(i).getOther_costs()) + " " + products.get(i).getCurrency());
                row1.createCell(4).setCellValue(NumberToTextConverter.toText(products.get(i).getRetail_price()) + " " + products.get(i).getCurrency());
                row1.createCell(5).setCellValue(NumberToTextConverter.toText(products.get(i).getFull_sale_price()) + " " + products.get(i).getCurrency());


//                int pictureureIdx = 0;
//                try {
//                    byte[] bytes = products.get(i).getContent();
//
//                    pictureureIdx = workbook.addPicture(bytes, Workbook.PICTURE_TYPE_JPEG);
//
//                    CreationHelper helper = workbook.getCreationHelper();
//                    Drawing drawing = sheet.createDrawingPatriarch();
//                    ClientAnchor anchor = helper.createClientAnchor();
//
//                    anchor.setCol1(0);
//                    anchor.setRow1(i);
//
//                    drawing.createPicture(anchor, pictureureIdx);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);
            sheet.autoSizeColumn(3);
            sheet.autoSizeColumn(4);
            sheet.autoSizeColumn(5);

            CellStyle style = workbook.createCellStyle();
            style.setWrapText(true);
            row.setRowStyle(style);

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            workbook.write(byteArrayOutputStream);

            return new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }


    }

    public ByteArrayInputStream exportLoansToExcel(List<CustomDebt> debts, Client client) {
        try {
            Workbook workbook = new XSSFWorkbook();

            Sheet sheet = workbook.createSheet(client.getFirstName() + " " + client.getLastName() + " " + client.getPhoneNumber());

            Row row = sheet.createRow(0);

            Font headerFont = workbook.createFont();
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            cellStyle.setFont(headerFont);

            Cell cell = row.createCell(0);
            cell.setCellValue("№");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(1);
            cell.setCellValue("To'lov summasi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(2);
            cell.setCellValue("Qarz summasi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(3);
            cell.setCellValue("Qarz farq");
            cell.setCellStyle(cellStyle);


            cell = row.createCell(4);
            cell.setCellValue("Turi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(5);
            cell.setCellValue("Sana");
            cell.setCellStyle(cellStyle);

            for (int i = 0; i < debts.size(); i++) {
                Row row1 = sheet.createRow(i + 1);

                row1.createCell(0).setCellValue(i + 1);
                row1.createCell(1).setCellValue((!debts.get(i).getLoan() ? debts.get(i).getAmount() : 0) + " so'm");
                row1.createCell(2).setCellValue((debts.get(i).getLoan() ? debts.get(i).getAmount() : 0) + " so'm");
                row1.createCell(3).setCellValue(debts.get(i).getSum() + " so'm");
                row1.createCell(4).setCellValue(debts.get(i).getLoan() ? "Qarz" : "To'lov");
                row1.createCell(5).setCellValue(debts.get(i).getCreated().toString().substring(0, 10));
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);
            sheet.autoSizeColumn(3);
            sheet.autoSizeColumn(4);
            sheet.autoSizeColumn(5);

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            workbook.write(byteArrayOutputStream);

            return new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ByteArrayInputStream exportSalesToExcel(List<CustomShoppingHistory> sales, Client client) {
        try {
            Workbook workbook = new XSSFWorkbook();

            Sheet sheet = workbook.createSheet(client.getFirstName() + " " + client.getLastName() + " " + client.getPhoneNumber());

            Row row = sheet.createRow(0);

            Font headerFont = workbook.createFont();
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            cellStyle.setFont(headerFont);

            Cell cell = row.createCell(0);
            cell.setCellValue("№");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(1);
            cell.setCellValue("Jami");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(2);
            cell.setCellValue("Qarz");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(3);
            cell.setCellValue("Chegirma");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(4);
            cell.setCellValue("Kassir");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(5);
            cell.setCellValue("Sana");
            cell.setCellStyle(cellStyle);

            for (int i = 0; i < sales.size(); i++) {
                Row row1 = sheet.createRow(i + 1);

                row1.createCell(0).setCellValue(i + 1);
                row1.createCell(1).setCellValue(sales.get(i).getTotal() + " so'm");
                row1.createCell(2).setCellValue(sales.get(i).getLoan() + " so'm");
                row1.createCell(3).setCellValue(sales.get(i).getDiscount() + " so'm");
                row1.createCell(4).setCellValue(sales.get(i).getSalesman() + " so'm");
                row1.createCell(5).setCellValue(sales.get(i).getCreated().toString().substring(0, 10));
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);
            sheet.autoSizeColumn(3);
            sheet.autoSizeColumn(4);
            sheet.autoSizeColumn(5);

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            workbook.write(byteArrayOutputStream);

            return new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ByteArrayInputStream exportDeliversToExcel(List<CustomShoppingDeliver> delivers) {
        try {
            Workbook workbook = new XSSFWorkbook();

            Sheet sheet = workbook.createSheet("Kirimlar Hisoboti");

            Row row = sheet.createRow(0);

            Font headerFont = workbook.createFont();
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            cellStyle.setFont(headerFont);

            Cell cell = row.createCell(0);
            cell.setCellValue("Mahsulot");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(1);
            cell.setCellValue("Soni");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(2);
            cell.setCellValue("Dollar kursi");
            cell.setCellStyle(cellStyle);


            cell = row.createCell(3);
            cell.setCellValue("Yaratilgan sana");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(4);
            cell.setCellValue("O'zgartirilgan Sani");
            cell.setCellStyle(cellStyle);

            for (int i = 0; i < delivers.size(); i++) {
                Row row1 = sheet.createRow(i + 1);
                row1.createCell(0).setCellValue(delivers.get(i).getParents());
                row1.createCell(1).setCellValue(NumberToTextConverter.toText(delivers.get(i).getAmount()));
                row1.createCell(2).setCellValue(NumberToTextConverter.toText(delivers.get(i).getUsd()));
                row1.createCell(3).setCellValue(delivers.get(i).getCreatedAt().toString().substring(0, 10));
                row1.createCell(4).setCellValue(delivers.get(i).getUpdatedAt().toString().substring(0, 10));
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);
            sheet.autoSizeColumn(3);
            sheet.autoSizeColumn(4);

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            workbook.write(byteArrayOutputStream);

            return new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    public BufferedImage scaleImage(int WIDTH, int HEIGHT, String filename) {
        BufferedImage bi = null;
        try {
            ImageIcon ii = new ImageIcon(filename);//path to image
            bi = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = (Graphics2D) bi.createGraphics();
            g2d.addRenderingHints(new RenderingHints(RenderingHints.KEY_RENDERING,RenderingHints.VALUE_RENDER_QUALITY));
            g2d.drawImage(ii.getImage(), 0, 0, WIDTH, HEIGHT, null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return bi;
    }
}
