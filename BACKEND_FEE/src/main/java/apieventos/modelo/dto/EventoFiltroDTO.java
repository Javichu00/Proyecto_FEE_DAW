package apieventos.modelo.dto;

import java.time.LocalDate;
import java.util.List;
import apieventos.modelo.enums.CategoriaEvento;
import apieventos.modelo.enums.EstadoEvento;
import apieventos.modelo.enums.Extremidad;

public class EventoFiltroDTO {

    private String nombre;
    private Integer idTipo;
    private List<CategoriaEvento> categorias;    // lista, no uno solo
    private List<Extremidad> extremidades;        // lista, no uno solo
    private Double precioMin;
    private Double precioMax;
    private EstadoEvento estado;
    private LocalDate fechaMin;                   // nuevo
    private LocalDate fechaMax;                   // nuevo
    private Integer aforoMinimo;                  // nuevo

    public EventoFiltroDTO() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getIdTipo() { return idTipo; }
    public void setIdTipo(Integer idTipo) { this.idTipo = idTipo; }

    public List<CategoriaEvento> getCategorias() { return categorias; }
    public void setCategorias(List<CategoriaEvento> categorias) { this.categorias = categorias; }

    public List<Extremidad> getExtremidades() { return extremidades; }
    public void setExtremidades(List<Extremidad> extremidades) { this.extremidades = extremidades; }

    public Double getPrecioMin() { return precioMin; }
    public void setPrecioMin(Double precioMin) { this.precioMin = precioMin; }

    public Double getPrecioMax() { return precioMax; }
    public void setPrecioMax(Double precioMax) { this.precioMax = precioMax; }

    public EstadoEvento getEstado() { return estado; }
    public void setEstado(EstadoEvento estado) { this.estado = estado; }

    public LocalDate getFechaMin() { return fechaMin; }
    public void setFechaMin(LocalDate fechaMin) { this.fechaMin = fechaMin; }

    public LocalDate getFechaMax() { return fechaMax; }
    public void setFechaMax(LocalDate fechaMax) { this.fechaMax = fechaMax; }

    public Integer getAforoMinimo() { return aforoMinimo; }
    public void setAforoMinimo(Integer aforoMinimo) { this.aforoMinimo = aforoMinimo; }
}