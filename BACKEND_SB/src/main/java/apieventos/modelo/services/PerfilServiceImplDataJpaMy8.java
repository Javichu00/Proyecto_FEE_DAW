package apieventos.modelo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apieventos.modelo.entities.Perfil;
import apieventos.modelo.repository.PerfilRepository;

@Service
public class PerfilServiceImplDataJpaMy8 implements PerfilService {
	
	@Autowired
	private PerfilRepository perfilRepository;

	@Override
	public Perfil insertOne(Perfil entity) {
		return perfilRepository.save(entity);
	}

	@Override
	public Perfil updateOne(Perfil entity) {
		if (perfilRepository.existsById(entity.getIdPerfil())) {
			return perfilRepository.save(entity);
			
		}else
			return null;
	}

	@Override
	public int deleteOne(Integer atributoPk) {
		
		try {
			if (perfilRepository.existsById(atributoPk)) {
				perfilRepository.deleteById(atributoPk);
				return 1;
			}else
				return 0;
		}catch(Exception e) {
		//	System.err.println(e.getMessage());
			IO.println(e.getMessage());
			return -1;
		}
	}

	@Override
	public Perfil findOne(Integer atributoPk) {
		// TODO Auto-generated method stub
		return perfilRepository.findById(atributoPk).orElse(null);
	}

	@Override
	public List<Perfil> findAll() {
		// TODO Auto-generated method stub
		return (List<Perfil>) perfilRepository.findAll();
	}

	@Override
	public List<Perfil> buscarPorNombreLike(String subcadena) {
		// TODO Auto-generated method stub
		return perfilRepository.findByNombreContaining(subcadena);
	}

}
