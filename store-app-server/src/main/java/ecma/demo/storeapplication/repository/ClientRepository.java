package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomClient;
import ecma.demo.storeapplication.entity.Client;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

import java.util.UUID;

public interface ClientRepository extends JpaRepository<Client, UUID> {
    @Query(value = "select cast(uuid as varchar) as id, first_name as name, last_name as surname," +
            " phone_number as number,description as description, created_at as registered," +
            " (select COALESCE(sum(lp.amount), 0) from loan_payment lp where c.uuid=lp.client_uuid) - " +
            "(select COALESCE(sum(l.loan_sum), 0) from loan l where c.uuid=l.client_uuid) as loan " +
            "from client c where (lower (c.first_name) like '%'||lower(:search)||'%' or " +
            "lower (c.last_name) like '%'||lower(:search)||'%'or " +
            "lower (c.phone_number) like '%'||lower(:search)||'%') " +
            "order by loan, created_at DESC limit :size offset :page*:size", nativeQuery = true)

    List<CustomClient> getAllClients(String search, Integer page, Integer size);

    @Query(value = "select count(*) from client c where (lower (c.first_name) like '%'||lower(:search)||'%' or lower (c.last_name) like '%'||lower(:search)||'%'or lower (c.phone_number) like '%'||lower(:search)||'%')", nativeQuery = true)
    Long getAllClientsCount(String search);

    @Query(value = "select count(*) from client c where ((select COALESCE(sum(lp.amount), 0) from loan_payment lp where c.uuid=lp.client_uuid)-(select COALESCE(sum(l.loan_sum), 0) from loan l where c.uuid=l.client_uuid)<0) and (lower (c.first_name) like '%'||lower(:search)||'%' or lower (c.last_name) like '%'||lower(:search)||'%'or lower (c.phone_number) like '%'||lower(:search)||'%')", nativeQuery = true)
    Long getAllClientsDebtCount(String search);

    @Query(value = "select cast(uuid as varchar) as id, c.first_name as name, c.last_name as surname, " +
            "c.phone_number as number from client c where " +
            "(lower (c.first_name) like '%'||lower(:search)||'%' or lower (c.last_name) like '%'||lower(:search)||'%'or lower (c.phone_number) like '%'||lower(:search)||'%')", nativeQuery = true)
    List<CustomClient> getSearchedClient(String search);

    Client getClientById(UUID id);

}
