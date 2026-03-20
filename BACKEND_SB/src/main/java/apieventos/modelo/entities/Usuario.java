package apieventos.modelo.entities;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="USUARIOS")
public class Usuario implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID_USUARIO")
	private Integer idUsuario;
	private String email;
	private String password;
	@Column(name="NOMBRE_COMPLETO")
	private String nombreCompleto;
	private Integer enabled;
	
	@Column(name="FECHA_REGISTRO")
	LocalDate fechaRegistro;
	
	@ManyToOne
	@JoinColumn(name="ID_PERFIL")
	private Perfil perfil;
	
	public Usuario() {
		// TODO Auto-generated constructor stub
	}

	public Usuario(Integer idUsuario, String email, String password, String nombreCompleto, Integer enabled,
			LocalDate fechaRegistro, Perfil perfil) {
		super();
		this.idUsuario = idUsuario;
		this.email = email;
		this.password = password;
		this.nombreCompleto = nombreCompleto;
		this.enabled = enabled;
		this.fechaRegistro = fechaRegistro;
		this.perfil = perfil;
	}

	public Integer getIdUsuario() {
		return idUsuario;
	}

	public void setIdUsuario(Integer idUsuario) {
		this.idUsuario = idUsuario;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getNombreCompleto() {
		return nombreCompleto; 
	}
	
	public void setNombreCompleto(String nombreCompleto) { 
		this.nombreCompleto = nombreCompleto; 
	}

	public Integer getEnabled() {
		return enabled;
	}

	public void setEnabled(Integer enabled) {
		this.enabled = enabled;
	}

	public LocalDate getFechaRegistro() {
		return fechaRegistro;
	}

	public void setFechaRegistro(LocalDate fechaRegistro) {
		this.fechaRegistro = fechaRegistro;
	}

	public Perfil getPerfil() {
		return perfil;
	}

	public void setPerfil(Perfil perfil) {
		this.perfil = perfil;
	}

	@Override
	public String toString() {
		return "Usuario [idUsuario=" + idUsuario + ", email=" + email + ", password=" + password + ", nombreCompleto=" + nombreCompleto + ", enabled=" + enabled + ", fechaRegistro=" + fechaRegistro + ", perfil="
				+ perfil + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(idUsuario);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!(obj instanceof Usuario))
			return false;
		Usuario other = (Usuario) obj;
		return Objects.equals(idUsuario, other.idUsuario);
	}
	
	

}
