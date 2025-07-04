package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    private Type type;

    @ManyToOne
    @JoinColumn(name = "employment_info_id")
    private EmploymentInfo employmentInfo;

    public Skill() {
    }

    public Skill(String name, Type type) {
        this.name = name;
        this.type = type;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public EmploymentInfo getEmploymentInfo() {
        return employmentInfo;
    }
    public void setEmploymentInfo(EmploymentInfo employmentInfo) {
        this.employmentInfo = employmentInfo;
    }

    public enum Type {
        SOFT, TECHNICAL
    }
}
