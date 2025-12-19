package pl.ceveme.domain.services.jobOffer;


import java.math.BigDecimal;

public class SalaryInfo {
    BigDecimal min;
    BigDecimal max;
    Currency currency;
    PayPeriod period;
    BigDecimal minMonthlyPln;
    BigDecimal maxMonthlyPln;

    public SalaryInfo(BigDecimal min) {
        this.min = min;
    }

    public SalaryInfo(BigDecimal min, BigDecimal max, Currency currency, PayPeriod period, BigDecimal minMonthlyPln, BigDecimal maxMonthlyPln) {
        this.min = min;
        this.max = max;
        this.currency = currency;
        this.period = period;
        this.minMonthlyPln = minMonthlyPln;
        this.maxMonthlyPln = maxMonthlyPln;
    }

    public BigDecimal getMin() {
        return min;
    }

    public void setMin(BigDecimal min) {
        this.min = min;
    }

    public BigDecimal getMax() {
        return max;
    }

    public void setMax(BigDecimal max) {
        this.max = max;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public PayPeriod getPeriod() {
        return period;
    }

    public void setPeriod(PayPeriod period) {
        this.period = period;
    }

    public BigDecimal getMinMonthlyPln() {
        return minMonthlyPln;
    }

    public void setMinMonthlyPln(BigDecimal minMonthlyPln) {
        this.minMonthlyPln = minMonthlyPln;
    }

    public BigDecimal getMaxMonthlyPln() {
        return maxMonthlyPln;
    }

    public void setMaxMonthlyPln(BigDecimal maxMonthlyPln) {
        this.maxMonthlyPln = maxMonthlyPln;
    }
}