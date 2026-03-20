package apieventos.modelo.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import apieventos.modelo.entities.Usuario;
import apieventos.modelo.repository.UsuarioRepository;

@Service
public class UsuarioServiceImplDataJpaMy8 implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Usuario insertOne(Usuario entity) {
        try {
            return usuarioRepository.save(entity);
        } catch (Exception e) {
            System.err.println("Error al insertar usuario: " + e.getMessage());
            return null;
        }
    }

    @Override
    public Usuario updateOne(Usuario entity) {
        try {
            if (usuarioRepository.existsById(entity.getIdUsuario()))
                return usuarioRepository.save(entity);
            return null;
        } catch (Exception e) {
            System.err.println("Error al actualizar usuario: " + e.getMessage());
            return null;
        }
    }

    @Override
    public int deleteOne(Integer idUsuario) {
        try {
            if (usuarioRepository.existsById(idUsuario)) {
                usuarioRepository.deleteById(idUsuario);
                return 1;
            }
            return 0;
        } catch (Exception e) {
            System.err.println("Error al eliminar usuario: " + e.getMessage());
            return -1;
        }
    }

    @Override
    public Usuario findOne(Integer idUsuario) {
        try {
            return usuarioRepository.findById(idUsuario).orElse(null);
        } catch (Exception e) {
            System.err.println("Error al buscar usuario: " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<Usuario> findAll() {
        try {
            return (List<Usuario>) usuarioRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error al listar usuarios: " + e.getMessage());
            return null;
        }
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        try {
            return usuarioRepository.findByEmail(email);
        } catch (Exception e) {
            System.err.println("Error al buscar usuario por email: " + e.getMessage());
            return Optional.empty();
        }
    }
}