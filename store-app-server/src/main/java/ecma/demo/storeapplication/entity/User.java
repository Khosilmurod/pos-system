package ecma.demo.storeapplication.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Users")
public class User extends AbsEntity implements UserDetails {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false,length = 13)
    private String phoneNumber;

    @Column(nullable = false,length = 2)
    private String passportSerial;

    @Column(nullable = false,length = 7)
    private String passportNumber;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    @ManyToMany(fetch = FetchType.LAZY)
    private List<Role> roles;

    public User(String firstName, String lastName, String phoneNumber, String passportSerial, String passportNumber, String username, String password, List<Role> roles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.passportSerial = passportSerial;
        this.passportNumber = passportNumber;
        this.username = username;
        this.password = password;
        this.roles = roles;
    }

    public User(String firstName, String lastName, String phoneNumber, String passportSerial, String passportNumber, String username, String password, List<Role> roles, Attachment attachment) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.passportSerial = passportSerial;
        this.passportNumber = passportNumber;
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.attachment=attachment;
    }

    private boolean accountNonExpired=true;
    private boolean accountNonLocked=true;
    private boolean credentialsNonExpired=true;
    private boolean enabled=true;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
