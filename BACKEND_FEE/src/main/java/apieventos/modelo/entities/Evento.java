package apieventos.modelo.entities;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import apieventos.modelo.enums.CategoriaEvento;
import apieventos.modelo.enums.EstadoEvento;
import apieventos.modelo.enums.Extremidad;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="EVENTOS")
public class Evento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ID_EVENTO")
    private Integer idEvento;

    private String nombre;
    private String descripcion;

    @Column(name="FECHA_INICIO")
    private LocalDate fechaInicio;

    @Column(name="FECHA_FIN")
    private LocalDate fechaFin;

    private String localizacion;

    @Column(name="AFORO_MAXIMO")
    private Integer aforoMaximo;

    @Enumerated(EnumType.STRING)
    private EstadoEvento estado;

    private Double precio;

    @ManyToOne
    @JoinColumn(name="ID_TIPO")
    private Tipo tipo;

    @Column(name="FECHA_ALTA")
    private LocalDate fechaAlta;

    @Column(name="RUTA_FOTO")
    private String rutaFoto;

    @Enumerated(EnumType.STRING)
    private CategoriaEvento categoria;

    @Enumerated(EnumType.STRING)
    private Extremidad extremidad;

    public Evento() {}

    public Evento(Integer idEvento, String nombre, String descripcion, LocalDate fechaInicio,
                  LocalDate fechaFin, String localizacion, Integer aforoMaximo, EstadoEvento estado,
                  Double precio, Tipo tipo, LocalDate fechaAlta, String rutaFoto,
                  CategoriaEvento categoria, Extremidad extremidad) {
        this.idEvento = idEvento;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.localizacion = localizacion;
        this.aforoMaximo = aforoMaximo;
        this.estado = estado;
        this.precio = precio;
        this.tipo = tipo;
        this.fechaAlta = fechaAlta;
        this.rutaFoto = rutaFoto;
        this.categoria = categoria;
        this.extremidad = extremidad;
    }

    public Integer getIdEvento() { return idEvento; }
    public void setIdEvento(Integer idEvento) { this.idEvento = idEvento; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public String getLocalizacion() { return localizacion; }
    public void setLocalizacion(String localizacion) { this.localizacion = localizacion; }

    public Integer getAforoMaximo() { return aforoMaximo; }
    public void setAforoMaximo(Integer aforoMaximo) { this.aforoMaximo = aforoMaximo; }

    public EstadoEvento getEstado() { return estado; }
    public void setEstado(EstadoEvento estado) { this.estado = estado; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Tipo getTipo() { return tipo; }
    public void setTipo(Tipo tipo) { this.tipo = tipo; }

    public LocalDate getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(LocalDate fechaAlta) { this.fechaAlta = fechaAlta; }

    public String getRutaFoto() { return rutaFoto; }
    public void setRutaFoto(String rutaFoto) { this.rutaFoto = rutaFoto; }

    public CategoriaEvento getCategoria() { return categoria; }
    public void setCategoria(CategoriaEvento categoria) { this.categoria = categoria; }

    public Extremidad getExtremidad() { return extremidad; }
    public void setExtremidad(Extremidad extremidad) { this.extremidad = extremidad; }

    @Override
    public String toString() {
        return "Evento [idEvento=" + idEvento + ", nombre=" + nombre + ", fechaInicio=" + fechaInicio
                + ", fechaFin=" + fechaFin + ", localizacion=" + localizacion + ", precio=" + precio + "]";
    }

    @Override
    public int hashCode() { return Objects.hash(idEvento); }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Evento)) return false;
        Evento other = (Evento) obj;
        return Objects.equals(idEvento, other.idEvento);
    }
}