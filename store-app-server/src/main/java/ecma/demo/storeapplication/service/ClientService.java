package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomClient;
import ecma.demo.storeapplication.entity.Client;
import ecma.demo.storeapplication.entity.TradeAll;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqClient;
import ecma.demo.storeapplication.repository.ClientRepository;
import ecma.demo.storeapplication.repository.LoanPaymentRepository;
import ecma.demo.storeapplication.repository.LoanRepository;
import ecma.demo.storeapplication.repository.TradeAllRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClientService {
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    LoanPaymentRepository loanPaymentRepository;
    @Autowired
    LoanRepository loanRepository;
    @Autowired
    TradeAllRepository tradeAllRepository;

    public HttpEntity<?> getAllClients(String search, Boolean isDebt, Integer page, Integer size, String sort) {
        List<CustomClient> clients = clientRepository.getAllClients(search,page - 1, size);
        List<CustomClient> collect=clients;
        Long count=clientRepository.getAllClientsCount(search);
        if(isDebt){
            collect = clients.stream().filter(item -> item.getLoan() < 0).collect(Collectors.toList());
            count=clientRepository.getAllClientsDebtCount(search);
        }
        sort(collect, sort);
        Page<CustomClient> responsePage = new PageImpl<>(collect, PageRequest.of(page - 1, size, Sort.by(sort).ascending()), count);
        return ResponseEntity.ok(new ApiResponse("success", true, responsePage));
    }

    public HttpEntity<?> getSearchedClient(String search) {
        List<CustomClient> searchedClient = clientRepository.getSearchedClient(search);
        return ResponseEntity.ok(new ApiResponse("success", true, searchedClient));
    }

    public HttpEntity<?> saveClient(ReqClient reqClient) {
        Client client = clientRepository.save(new Client(
                reqClient.getName(),
                reqClient.getSurname(),
                reqClient.getNumber(),
                reqClient.getDescription()));
        return ResponseEntity.ok(new ApiResponse("success", true, client.getId()));
    }

    public HttpEntity<?> editClient(ReqClient reqClient, UUID clientId) {
        Client client = clientRepository.findById(clientId).get();
        client.setFirstName(reqClient.getName());
        client.setLastName(reqClient.getSurname());
        client.setPhoneNumber(reqClient.getNumber());
        client.setDescription(reqClient.getDescription());

        return ResponseEntity.ok(new ApiResponse("success", true, clientRepository.save(client)));
    }

    public HttpEntity<?> deleteClient(UUID clientId) {
        List<TradeAll> tradeAll = tradeAllRepository.findAllByClientId(clientId);
        if (tradeAll.size() == 0 && loanPaymentRepository.findAllByClientId(clientId).size() == 0) {
            try {
                clientRepository.deleteById(clientId);
                return ResponseEntity.ok(new ApiResponse("success", true));
            } catch (Exception e) {
                return ResponseEntity.ok(new ApiResponse("error", false));
            }
        } else {
            return ResponseEntity.ok(new ApiResponse("failed", false));
        }
    }


    private List<CustomClient> sort(List<CustomClient> custom, String sortBy) {
        if (sortBy.equals("name")) {
            Comparator<CustomClient> compareBySurname = (CustomClient o1, CustomClient o2) -> o1.getName().compareTo(o2.getName());
            Collections.sort(custom, compareBySurname);
        }
        if (sortBy.equals("surname")) {
            Comparator<CustomClient> compareBySurname = (CustomClient o1, CustomClient o2) -> o1.getSurname().compareTo(o2.getSurname());
            Collections.sort(custom, compareBySurname);
        }
        if (sortBy.equals("phoneNumber")) {
            Comparator<CustomClient> compareBySurname = (CustomClient o1, CustomClient o2) -> o1.getNumber().compareTo(o2.getNumber());
            Collections.sort(custom, compareBySurname);
        }
        return custom;
    }


}
