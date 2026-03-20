package apieventos.modelo.services;

import java.util.List;

import apieventos.modelo.entities.Perfil;

public interface PerfilService extends GenericService<Perfil, Integer>{
	
	List<Perfil> buscarPorNombreLike(String subcadena);

}
