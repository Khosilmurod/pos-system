package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomTree;
import ecma.demo.storeapplication.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findByParentId(UUID parentId);

    @Query(value = "select * from category c where c.parent_uuid=:parentId", nativeQuery = true)
    Page<Category> findCategoriesByParent(UUID parentId, Pageable pageable);

    @Query(value = "select * from (select cast(c.uuid as varchar(50)) as id, cast(c.parent_uuid as varchar(50)) as parent, c.name as label, false as boolean from category c union all select cast(p.uuid as varchar(50)) as id, cast(p.category_uuid as varchar(50)) as parent, p.name as label, true as boolean from product p) r order by r.label" +
            "", nativeQuery = true)
    List<CustomTree> getAll();

    @Query(value = "select * from (select cast(c.uuid as varchar(50)) as id, cast(c.parent_uuid as varchar(50)) as parent, " +
            "c.name as label, false as boolean from category c union all select cast(p.uuid as varchar(50)) as id, " +
            "cast(p.category_uuid as varchar(50)) as parent, p.name as label, true as boolean from product p) as l " +
            "where lower(l.label) like '%'||:search||'%' order by l.boolean desc", nativeQuery = true)
    List<CustomTree> getSearched(String search);

    @Query(value = "select cast(c.uuid as varchar(50)) as id, cast(c.parent_uuid as varchar(50)) as parent, c.name as label, false as boolean from category c where c.uuid=:parent", nativeQuery = true)
    List<CustomTree> getParent(UUID parent);

    @Query(value = "select cast(c.uuid as varchar(50)) as id, cast(c.parent_uuid as varchar(50)) as parent, c.name as label, false as boolean from category c where c.uuid=:id union all select cast(p.uuid as varchar(50)) as id, cast(p.category_uuid as varchar(50)) as parent, p.name as label, true as boolean from product p where p.uuid=:id", nativeQuery = true)
    CustomTree getCategoryParent(UUID id);

//    @Query(value = "select cast(c.uuid as varchar(50)) as id, cast(c.parent_uuid as varchar(50)) as parent, c.name as label, false as boolean from category c where c.uuid=:id union all select cast(p.uuid as varchar(50)) as id, cast(p.category_uuid as varchar(50)) as parent, p.name as label, true as boolean from product p where p.uuid=:id", nativeQuery = true)
//    CustomTree getTreeOne(UUID id);

}
