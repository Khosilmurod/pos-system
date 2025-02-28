package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.*;
import ecma.demo.storeapplication.entity.*;
import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.entity.enums.PayType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqData;
import ecma.demo.storeapplication.payload.ReqEditTradeAll;
import ecma.demo.storeapplication.payload.ReqTradeAll;
import ecma.demo.storeapplication.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class TradeAllService {
    @Autowired
    TradeAllRepository tradeAllRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    LoanRepository loanRepository;
    @Autowired
    DiscountRepository discountRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    TradeRepository tradeRepository;
    @Autowired
    SettingsRepository settingsRepository;

    public HttpEntity<?> shoppingHistory(UUID clientId, Integer size, Integer page) {

        List<CustomShoppingHistory> customShoppingHistories = tradeAllRepository.shoppingHistory(clientId, size, page);

        Page<CustomShoppingHistory> returnPage = new PageImpl<>(customShoppingHistories, PageRequest.of(page, size), tradeAllRepository.getShoppingHistoryCount(clientId));

        return ResponseEntity.ok(new ApiResponse("success", true, returnPage));
    }

    public HttpEntity<?> save(ReqTradeAll reqTradeAll) {

        try {
            Client client = null;

            if (reqTradeAll.getClientId() != null) {
                Optional<Client> optionalClient = clientRepository.findById(reqTradeAll.getClientId());
                if (optionalClient.isPresent()) {
                    client = optionalClient.get();
                }
            }
            TradeAll tradeAll = tradeAllRepository.save(new TradeAll(reqTradeAll.getDiscount(), client));

            if(reqTradeAll.getDebt()!=null&&reqTradeAll.getDebt()!=0){
                loanRepository.save(new Loan(reqTradeAll.getDebt(), null, client, tradeAll));
            }
            tradeAll.setClient(client);
            paymentRepository.save(new Payment(reqTradeAll.getCash(), PayType.CASH, tradeAll));
            paymentRepository.save(new Payment(reqTradeAll.getCard(), PayType.CARD, tradeAll));
            paymentRepository.save(new Payment(reqTradeAll.getBank(), PayType.BANK, tradeAll));
            discountRepository.save(new Discount(reqTradeAll.getDiscount(), tradeAll));

            for (ReqData data : reqTradeAll.getData()) {
                Double usd = settingsRepository.findAll().get(0).getUsd();
                Double productPrice = (double) 0;
                Product product = productRepository.findById(data.getProductId()).get();

                Trade trade = new Trade();
                trade.setAmount(data.getAmount());

                if (product.getCurrencyType() == CurrencyType.USD) {
                    productPrice = product.getRetailPrice() * usd;
                }
                if (product.getCurrencyType() == CurrencyType.UZS) {
                    productPrice = product.getRetailPrice();

                }

                trade.setDiscountPrice(productPrice - data.getDiscountPrice());
                trade.setUsd(usd);
                trade.setCurrencyType(product.getCurrencyType());
                trade.setProduct(product);
                trade.setRetailPrice(product.getRetailPrice());
                trade.setTradeAll(tradeAll);
                tradeRepository.save(trade);
                product.setDiscountPrice(productPrice - data.getDiscountPrice());
                productRepository.save(product);
            }

            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getHistory(
//            String search,
            String start, String end, int page, int size) {
        start=start.substring(0,11);
        end=end.substring(0,11);
        List<CustomShoppingHistory> list = tradeAllRepository.getHistory(start, end, size, page);
        Page<CustomShoppingHistory> all=new PageImpl<>(list, PageRequest.of(page, size), tradeAllRepository.getHistoryCount(start, end));
        return ResponseEntity.ok(new ApiResponse("success", true, all));
    }

    public HttpEntity<?> edit(UUID id, ReqEditTradeAll reqEditTradeAll) {
        try {
            TradeAll tradeAll = tradeAllRepository.findById(id).get();
            Loan loan = loanRepository.findByTradeAllId(id);
            Discount discount = discountRepository.findByTradeAllId(id);
            Payment cash = paymentRepository.findAllByTradeAllIdAndPayType(id, PayType.CASH);
            Payment card = paymentRepository.findAllByTradeAllIdAndPayType(id, PayType.CARD);
            Payment bank = paymentRepository.findAllByTradeAllIdAndPayType(id, PayType.BANK);

            if (card != null) {
                card.setReceivedSum(reqEditTradeAll.getCard());
                paymentRepository.save(card);
            }
            if (cash != null) {
                cash.setReceivedSum(reqEditTradeAll.getCash());
                paymentRepository.save(cash);
            }
            if (bank != null) {
                bank.setReceivedSum(reqEditTradeAll.getBank());
                paymentRepository.save(bank);
            }
            if (discount != null) {
                discount.setAmount(reqEditTradeAll.getDiscount());
                discountRepository.save(discount);
            }
            if (loan != null) {
                loan.setLoanSum(toNumber(reqEditTradeAll.getTrade() - reqEditTradeAll.getCash() - reqEditTradeAll.getCard() - reqEditTradeAll.getBank() - reqEditTradeAll.getDiscount()));
                loanRepository.save(loan);
            }else{
                Loan loan1=new Loan();
                loan1.setTradeAll(tradeAll);
                loan1.setLoanSum(toNumber(reqEditTradeAll.getTrade() - reqEditTradeAll.getCash() - reqEditTradeAll.getCard() - reqEditTradeAll.getBank() - reqEditTradeAll.getDiscount()));
                loanRepository.save(loan1);
            }

            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> saleHistory(String date) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-mm-yyyy");
            LocalDate localDate = LocalDate.parse(date);

            List<CustomTodayHistory> todayHistory = tradeAllRepository.getTodayHistory(localDate);
            return ResponseEntity.ok(new ApiResponse("success", true, todayHistory));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> productSaleHistory(String start, String end, UUID productId) {
        try {
//            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-mm-yyyy");
//            LocalDate starts = LocalDate.parse(start);
//            LocalDate ends = LocalDate.parse(end);
            start=start.substring(0,11);
            end=end.substring(0,11);

            List<CustomTodayHistoryRange> todayHistory = tradeAllRepository.getTodayProductHistoryRange(start, end, productId);
            return ResponseEntity.ok(new ApiResponse("success", true, todayHistory));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getOne(UUID id) {
        try {
            List<CustomOneTradeAll> oneTradeAll = tradeAllRepository.getOneTradeAll(id);
            return ResponseEntity.ok(new ApiResponse("success", true, oneTradeAll.get(0)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public Double toNumber(Double number) {
        if (number >= 0) {
            return number;
        }
        return (double) 0;
    }
}
