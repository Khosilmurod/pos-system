package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomDebt;
import ecma.demo.storeapplication.entity.LoanPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface LoanPaymentRepository extends JpaRepository<LoanPayment, UUID> {
    List<LoanPayment> findAllByClientId(UUID client);
    @Query(value = "select *\n" +
            "from (select lp.created_at                                                                                           as created,\n" +
            "             lp.amount                                                                                               as amount,\n" +
            "             (select coalesce(sum(lp2.amount), 0)\n" +
            "              from loan_payment lp2\n" +
            "              where lp2.created_at <= lp.created_at\n" +
            "                and lp2.client_uuid = :client) - (select coalesce(sum(l2.loan_sum), 0)\n" +
            "                                                  from loan l2\n" +
            "                                                  where l2.created_at <= lp.created_at\n" +
            "                                                    and l2.client_uuid = :client)                                    as sum,\n" +
            "             false                                                                                                   as loan\n" +
            "      from loan_payment lp\n" +
            "      where lp.client_uuid = :client\n" +
            "      union\n" +
            "      select l.created_at as created,\n" +
            "             l.loan_sum   as amount,\n" +
            "             (select coalesce(sum(lp2.amount), 0)\n" +
            "              from loan_payment lp2\n" +
            "              where lp2.created_at <= l.created_at\n" +
            "                and lp2.client_uuid = :client) -\n" +
            "             (select coalesce(sum(l2.loan_sum), 0) from loan l2 where l2.created_at <= l.created_at),\n" +
            "             true         as loan\n" +
            "      from loan l\n" +
            "      where l.client_uuid = :client\n" +
            "        and l.client_uuid = :client) t\n" +
            "order by t.created desc \n" +
            "limit :size offset :size*:page", nativeQuery = true)
    List<CustomDebt> getDebtHistory(UUID client, Integer size, Integer page);

    @Query(value = "select count(*)\n" +
            "from (select lp.created_at                                                        as created,\n" +
            "             lp.amount                                                            as amount,\n" +
            "             (select coalesce(sum(lp2.amount), 0)\n" +
            "              from loan_payment lp2\n" +
            "              where lp2.created_at <= lp.created_at\n" +
            "                and lp2.client_uuid = :client) - (select coalesce(sum(l2.loan_sum), 0)\n" +
            "                                                  from loan l2\n" +
            "                                                  where l2.created_at <= lp.created_at\n" +
            "                                                    and l2.client_uuid = :client) as sum,\n" +
            "             false                                                                as loan\n" +
            "      from loan_payment lp\n" +
            "      where lp.client_uuid = :client\n" +
            "      union\n" +
            "      select l.created_at as created,\n" +
            "             l.loan_sum   as amount,\n" +
            "             (select coalesce(sum(lp2.amount), 0)\n" +
            "              from loan_payment lp2\n" +
            "              where lp2.created_at <= l.created_at\n" +
            "                and lp2.client_uuid = :client) -\n" +
            "             (select coalesce(sum(l2.loan_sum), 0) from loan l2 where l2.created_at <= l.created_at),\n" +
            "             true         as loan\n" +
            "      from loan l\n" +
            "      where l.client_uuid = :client\n" +
            "        and l.client_uuid = :client) t", nativeQuery = true)
    Integer getDebtHistoryCount(UUID client);
}
