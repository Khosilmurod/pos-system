package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);


//    @Query(value = "select cast(p.uuid as varchar(50)) as id, p.name as name, p.retail_price as salePrice, " +
//            "cast(p.attachment_uuid as varchar(50)) as attachmentId " +
//            " from product p where p.uuid=:uuid", nativeQuery = true)


    @Query(value = "select cast(users.uuid as varchar(50)) as id, users.first_name as firstname, users.last_name as lastname," +
            " users.username as username, users.phone_number as phonenumber, users.passport_serial as passportSerial," +
            " users.passport_number as passportNumber, " +
            "cast(users.attachment_uuid as varchar(50)) as attachmentId from users left join attachment a on users.attachment_uuid = a.uuid where users.uuid=:uuid", nativeQuery = true)
    List<User> findUserById(UUID uuid);

}
