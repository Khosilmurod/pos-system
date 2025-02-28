package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.repository.DeliverAllRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DeliverAllService {
    @Autowired
    DeliverAllRepository deliverAllRepository;

}
