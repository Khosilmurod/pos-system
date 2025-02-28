package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import java.util.regex.Pattern;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Settings extends AbsEntity {
    private Double usd;
    private boolean showWaste;

    public Settings(boolean showWaste) {
        this.showWaste = showWaste;
    }

    public Settings(Double usd) {
        this.usd = usd;
    }
}
