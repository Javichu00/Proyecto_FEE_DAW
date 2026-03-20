package apieventos.modelo.repository;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import apieventos.modelo.entities.Usuario;

public interface UsuarioRepository extends CrudRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
}