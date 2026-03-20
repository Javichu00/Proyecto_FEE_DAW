package apieventos.modelo.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import apieventos.modelo.entities.Perfil;

public interface PerfilRepository extends CrudRepository<Perfil, Integer>{
	
	List<Perfil> findByNombreContaining(String subcadena);

}
