package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "portfolioItems")
public class PortfolioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Lob
    private String description;
    private String url;

    @ManyToOne
    @JoinColumn(name = "employment_info_id")
    private EmploymentInfo employmentInfo;


    public PortfolioItem() {
    }

    public PortfolioItem(String title, String description, String url) {
        this.title = title;
        this.description = description;
        this.url = url;
    }

    public void update(String title, String description) {
        this.title = title;
        this.description = description;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public EmploymentInfo getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfo employmentInfo) {
        this.employmentInfo = employmentInfo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
