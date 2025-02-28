package ecma.demo.storeapplication.config;

import ecma.demo.storeapplication.entity.enums.RoleName;
import ecma.demo.storeapplication.security.AuthService;
import ecma.demo.storeapplication.security.JwtAuthenticationEntryPoint;
import ecma.demo.storeapplication.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Role;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.GetMapping;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    AuthService authService;
    @Autowired
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(authService).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf()
                .disable()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/",
                        "/favicon.ico",
                        "/**/*.png",
                        "/**/*.gif",
                        "/**/*.svg",
                        "/**/*.jpg",
                        "/**/*.html",
                        "/**/*.css",
                        "/**/*.js",
                        "/swagger-ui.html",
                        "/swagger-resources/**",
                        "/v2/**",
                        "/csrf",
                        "/webjars/**")
                .permitAll()
                .antMatchers(
                        "/api/auth",
                        "/api/user/me"
                )
                .permitAll()
//                .antMatchers(
////                        "/api/file/{id}",
//                        "/api/download/product.xlsx",
//                        "/api/loanPayment/**",
//                        "/api/product/remain",
//                        "/api/tradeAll/history",
//                        "/api/trade/income",
//                        "/api/trade/stat",
//                        "/api/user/all",
//                        "/api/user",
//                        "/api/user/{id}",
//                        "/api/waste/{id}"
//                ).hasAnyRole("DIRECTOR", "CASHIER")
//                .antMatchers(
//                        HttpMethod.DELETE,
//                        "/api/deliver/{id}"
//                ).hasAnyRole("DIRECTOR", "CASHIER")
//                .antMatchers(
//                        HttpMethod.PUT,
//                        "/api/settings",
//                        "/api/settings/waste"
//                ).hasAnyRole("DIRECTOR", "CASHIER")
//                .antMatchers(
//                        HttpMethod.GET,
//                        "/api/waste"
//                ).hasAnyRole("DIRECTOR", "CASHIER")
//                .antMatchers(
//                        HttpMethod.POST,
//                        "/api/deliver",
//                        "/api/waste"
//                ).hasAnyRole("WAREHOUSE")
//                .antMatchers(
//                        HttpMethod.PUT,
//                        "/api/deliver/{id}"
//                ).hasAnyRole("WAREHOUSE")
//                .antMatchers(
//                        "/api/deliver/history/{id}",
//                        "/api/product/{id}",
//                        "/api/product/search",
//                        "/api/product/store/{id}",
//                        "/api/product/category",
//                        "/api/product"
//                ).hasAnyRole("WAREHOUSE")
//                .antMatchers(
//                        "/api/product/sale/{id}",
//                        "/api/tradeAll",
//                        "/api/tradeAll/saleHistory"
//                ).hasAnyRole("CASHIER")
//                .antMatchers(
//                        "/api/client/**",
//                        "/api/trade/history"
//                ).hasAnyRole("DIRECTOR", "CASHIER")
//                .antMatchers(
//                        "/api/category/searchedTree",
//                        "/api/category/tree",
//                        "/api/category/{id}",
//                        "/api/category/one/{id}",
//                        "/api/category/parent"
//                ).hasAnyRole("CASHIER", "WAREHOUSE")
////                .antMatchers(
////                        "/api/file",
////                        "/api/file/save"
////                ).hasAnyRole("DIRECTOR", "WAREHOUSE")
//                .antMatchers(
//                        HttpMethod.GET,
//                        "/api/category",
//                        "/api/category/tree/search"
//                        ).hasAnyRole("CASHIER", "WAREHOUSE")
//                .and()
                .antMatchers(
                        "api/**"
                ).hasAnyRole("CASHIER", "WAREHOUSE", "DIRECTOR")
                .and()
                .cors();

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }
}