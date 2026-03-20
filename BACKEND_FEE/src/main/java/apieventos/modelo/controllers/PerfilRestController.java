package apieventos.modelo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apieventos.modelo.entities.Perfil;
import apieventos.modelo.services.PerfilService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/perfiles")
public class PerfilRestController {
	
	@Autowired
	private PerfilService perfilService;
	
	
	@GetMapping("/")
	public List<Perfil> todos(){
		return perfilService.findAll();
	}
	
	@GetMapping("/{idPerfil}")
	
	Perfil buscarUno(@PathVariable int idPerfil) {
		
		return perfilService.findOne(idPerfil);
		
	}

 	@PostMapping("/")
 	
 	Perfil altaPerfil(@RequestBody Perfil perfil ) {
 		
 		return perfilService.insertOne(perfil);
 		
 	}	
 	
 		
	@PutMapping("/{idPerfil}")
	Perfil modificarPerfil(@PathVariable Integer idPerfil, @RequestBody Perfil perfil){
		
		perfil.setIdPerfil(idPerfil);
		return perfilService.updateOne(perfil);
	
		
	}
	
	@DeleteMapping("/{idPerfil}")
	
	public String eliminarPerfil(@PathVariable Integer idPerfil) {
		
		switch(perfilService.deleteOne(idPerfil)) {
		case 1: return "Perfil eliminado";
		case 0: return "Este perfil no existe, operacion cancelada";
		case -1 : return "Este perfil NOOO se puede eliminar, hay usuarios de este perfil";
		default: return "";
		}
	}
	/*			
	@GetMapping("/nombre/{subcadena}")
*/	 
}
