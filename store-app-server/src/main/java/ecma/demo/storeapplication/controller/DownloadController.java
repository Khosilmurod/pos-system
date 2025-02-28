package ecma.demo.storeapplication.controller;


import ecma.demo.storeapplication.custom.CustomDebt;
import ecma.demo.storeapplication.custom.CustomShoppingDeliver;
import ecma.demo.storeapplication.custom.CustomShoppingHistory;
import ecma.demo.storeapplication.entity.Client;
import ecma.demo.storeapplication.repository.*;
import ecma.demo.storeapplication.service.ExcelExporter;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("api/download")
public class DownloadController {

    @Autowired
    ProductRepository productRepository;
    @Autowired
    ExcelExporter excelExporter;
    @Autowired
    LoanPaymentRepository loanPaymentRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    TradeAllRepository tradeAllRepository;
    @Autowired
    DeliverRepository deliverRepository;

    @GetMapping("/product.xlsx")
    public void downloadProductsWithExcelFormat (HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition","attachment; filename=product.xlsx");

        ByteArrayInputStream byteArrayInputStream = excelExporter.exportProductsToExcel(productRepository.getProductRemain("", 0, 10000));

        IOUtils.copy(byteArrayInputStream,response.getOutputStream());
    }

    @GetMapping("/deliver.xlsx")
    public void downloadDeliversWithExcelFormat (HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition","attachment; filename=product.xlsx");

        List<CustomShoppingDeliver> list = deliverRepository.findAllHistory("",1000000, 0);
        ByteArrayInputStream byteArrayInputStream = excelExporter.exportDeliversToExcel(list);

        IOUtils.copy(byteArrayInputStream,response.getOutputStream());
    }

    @GetMapping("/sale.xlsx")
    public void downloadSaleWithExcelFormat (HttpServletResponse response, @RequestParam UUID clientId) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition","attachment; filename=product.xlsx");

        Client client = clientRepository.findById(clientId).get();
        List<CustomShoppingHistory> saleHistory = tradeAllRepository.shoppingHistory(clientId, 1000000, 0);
        ByteArrayInputStream byteArrayInputStream = excelExporter.exportSalesToExcel(saleHistory, client);

        IOUtils.copy(byteArrayInputStream,response.getOutputStream());
    }

    @GetMapping("/loan.xlsx")
    public void downloadLoansWithExcelFormat (HttpServletResponse response, @RequestParam UUID clientId) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition","attachment; filename=product.xlsx");

        Client client = clientRepository.findById(clientId).get();
        List<CustomDebt> debtHistory = loanPaymentRepository.getDebtHistory(clientId, 10000000, 0);
        ByteArrayInputStream byteArrayInputStream = excelExporter.exportLoansToExcel(debtHistory, client);

        IOUtils.copy(byteArrayInputStream,response.getOutputStream());
    }
}
