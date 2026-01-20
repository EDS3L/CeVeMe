package pl.ceveme.domain.model.vo;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {

    private String city;
    private String street;
    private Double latitude;
    private Double longitude;
    private String voivodeships;

    public Location() {
    }

    public Location(String city, String street, Double latitude, Double longitude) {
        this.city = city;
        this.street = street;
        this.latitude = latitude;
        this.longitude = longitude;

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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getVoivodeships() {
        return voivodeships;
    }

    public void setVoivodeships(String voivodeships) {
        this.voivodeships = voivodeships;
    }
}