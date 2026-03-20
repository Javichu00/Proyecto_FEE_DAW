package apieventos.modelo.services;

import java.util.Optional;
import apieventos.modelo.entities.Usuario;

public interface UsuarioService extends GenericService<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
}