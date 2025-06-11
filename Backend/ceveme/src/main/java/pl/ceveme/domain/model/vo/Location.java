package pl.ceveme.domain.model.vo;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {

    private String city;

    private String street;

    public Location() {
    }

    public Location(String city, String street) {
        this.city = city;
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }
}